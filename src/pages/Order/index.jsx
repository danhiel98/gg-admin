import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Drawer } from 'antd';
import React, { useState, useRef, useCallback } from 'react';
import { useIntl, FormattedMessage, connect } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import CreateForm from './components/CreateForm';
import { queryOrders, updateOrder, addOrder, queryOrder, removeOrder } from './service';
import { currencyFormat, dateFromTimestamp } from '@/utils/dataFunctions';
import renderHTML from 'react-render-html';
import Gallery from 'react-photo-gallery';
import Carousel, { Modal, ModalGateway } from 'react-images';
import { isEmpty } from '@/utils/utils';

const handleAdd = async (fields, attachments) => {
	const hide = message.loading('Agregando', 0);

	try {
		let res = await addOrder({ ...fields }, attachments);
		message.success('¡Registro agregado correctamente!');
		return true;
	} catch (error) {
		message.error('Error al intentar agregar el registro');
		return false;
	} finally {
		hide();
	}
};

const handleGet = async (order_id) => {
	const hide = message.loading('Agregando');

	try {
		let data = await getOrder(order_id);

		return data;
	} catch (error) {
		message.error('Error al obtener el registro');
	}
	finally {
		hide();
	}
}

const handleUpdate = async (fields, record) => {
	const hide = message.loading('Cargando');

	try {
		await updateOrder(fields, record);
		hide();
		message.success('¡Registro actualizado correctamente!');
		return true;
	} catch (error) {
		hide();
		message.error('No se pudo actualizar el registro');
		return false;
	}
};

const handleRemove = async (selectedRows) => {
	const hide = message.loading('Cargando');
	if (!selectedRows) return true;

	try {
		await removeOrder({
			key: selectedRows.map((row) => row.key),
		});
		hide();
		message.success('¡Cliente eliminado correctamente!');
		return true;
	} catch (error) {
		hide();
		message.error('No se pudo eliminar al cliente');
		return false;
	}
};

const Order = (props) => {
	const [createModalVisible, handleModalVisible] = useState(false); // Modal de registro
	const [updateModalVisible, handleUpdateModalVisible] = useState(false); // Modal de edición
	const [showDetail, setShowDetail] = useState(false); // Modal de detalle
	const [photos, setPhotos] = useState([]);
	const [currentImage, setCurrentImage] = useState(0);
	const [viewerIsOpen, setViewerIsOpen] = useState(false);

	const actionRef = useRef();
	const [currentRow, setCurrentRow] = useState(); // Registro seleccionado
	const [selectedRowsState, setSelectedRows] = useState([]); // No sé, xd

	const openLightbox = useCallback((event, { photo, index }) => {
		setCurrentImage(index);
		setViewerIsOpen(true);
	}, []);

	const closeLightbox = () => {
		setCurrentImage(0);
		setViewerIsOpen(false);
	};

	const activeData = (entity) => {
		setCurrentRow(entity);

		if (entity.images) {
			setPhotos(entity.images.map(img => {
				let obj = {
					src: img,
					width: 1,
					height: 1,
				}

				return obj;
			}))
		}
	}

	const { currentUser } = props;
	const intl = useIntl();
	const columns = [
		{
			title: <FormattedMessage id="pages.order.titleTitle" defaultMessage="Title" />,
			dataIndex: 'title',
			render: (dom, entity) => {
				return (
					<a
						onClick={() => {
							activeData(entity);
							setShowDetail(true);
						}}
					>
						{dom}
					</a>
				);
			},
		},
		{
			title: <FormattedMessage id="pages.order.titleCustomer" defaultMessage="Customer" />,
			dataIndex: 'customer',
			render: (dom, entity) => {
				return (
					<a
						onClick={() => {
							console.log(entity);
						}}
					>
						{dom}
					</a>
				);
			},
		},
		{
			title: (
				<FormattedMessage id="pages.order.titleOrderStatus" defaultMessage="Order Status" />
			),
			dataIndex: 'status',
			hideInForm: true,
			valueEnum: {
				pendiente: {
					text: (
						<strong>
							<FormattedMessage
								id="pages.order.status.pending"
								defaultMessage="Pending"
							/>
						</strong>
					),
					status: 'Default',
				},
				entregado: {
					text: (
						<strong>
							<FormattedMessage
								id="pages.order.status.delivered"
								defaultMessage="Delivered"
							/>
						</strong>
					),
					status: 'Success',
				},
				cancelado: {
					text: (
						<strong>
							<FormattedMessage
								id="pages.order.status.cancelled"
								defaultMessage="Cancelled"
							/>
						</strong>
					),
					status: 'Warning',
				},
			},
		},
		{
			title: <FormattedMessage id="pages.order.titleDeadline" defaultMessage="Deadline" />,
			dataIndex: 'deadline',
			render: (value) => {
				return <strong>{dateFromTimestamp(value)}</strong>;
			},
		},
		{
			title: <FormattedMessage id="pages.order.titleTotal" defaultMessage="Total" />,
			sorter: true,
			dataIndex: 'total',
			render: (value) => {
				return <strong>{currencyFormat(value)}</strong>;
			},
		},
		{
			title: <FormattedMessage id="pages.order.titleRemaining" defaultMessage="Remaining" />,
			sorter: true,
			dataIndex: 'remaining',
			render: (value) => {
				return <strong>{currencyFormat(value)}</strong>;
			},
		},
	];

	if (!isEmpty(currentUser)) {
		columns.push({
			title: <FormattedMessage id="pages.order.titleOption" defaultMessage="Option" />,
			dataIndex: 'option',
			valueType: 'option',
			render: (_, entity) => [
				<a
					key="edit"
					onClick={() => {
						activeData(entity);
						handleUpdateModalVisible(true);
					}}
				>
					<FormattedMessage id="pages.order.edit" defaultMessage="Edit" />
				</a>,
				<a
					key="delete"
					onClick={() => {
						console.log('Me quieres eliminar ¿Acaso no sabes quien soy?');
					}}
				>
					<FormattedMessage id="pages.order.delete" defaultMessage="Delete" />
				</a>,
			],
		});
	}

	return (
		<PageContainer>
			<ProTable
				headerTitle={intl.formatMessage({
					id: 'pages.order.title',
					defaultMessage: 'Título',
				})}
				actionRef={actionRef}
				rowKey="key"
				search={{
					labelWidth: 120,
				}}
				toolBarRender={() => [
					!isEmpty(currentUser) && <Button
						type="primary"
						key="primary"
						onClick={() => {
							handleModalVisible(true);
						}}
					>
						<PlusOutlined />{' '}
						<FormattedMessage id="pages.order.new" defaultMessage="New" />
					</Button>,
				]}
				request={(params, sorter, filter) => queryOrders({ ...params, sorter, filter })}
				columns={columns}
				rowSelection={{
					onChange: (_, selectedRows) => {
						setSelectedRows(selectedRows);
					},
				}}
			/>
			<CreateForm
				visible={createModalVisible}
				visibleChange={() => {
					handleModalVisible(!createModalVisible);
				}}
				record={currentRow || null}
				onFinish={async (data, attachments) => {
					const success = await handleAdd(data, attachments);

					console.log(`Success en onFinish: ${success}`);

					if (success) {
						handleModalVisible(false);

						if (actionRef.current) actionRef.current.reload();
						
						return true;
					}
				}}
			/>

			<Drawer
				placement="bottom"
				visible={showDetail && currentRow}
				onClose={() => {
					setCurrentRow(undefined);
					setShowDetail(false);
				}}
				closable={false}
				height={450}
			>
				{currentRow?.title && (
					<div>
						<ProDescriptions
							layout="horizontal"
							column={2}
							title={currentRow?.title}
							request={async () => ({
								data: currentRow || {},
							})}
							params={{
								id: currentRow?.title,
							}}
							columns={columns}
						/>
						<div style={{ border: '1px solid #d7cece', borderRadius: 5, padding: 15, marginBottom: 20 }}>
							{renderHTML(currentRow.description)}
						</div>
						<div style={{ width: photos.length <= 4 ? 500 : 800, alignItems: 'center' }}>
							<Gallery
								margin={20}
								onClick={openLightbox}
								photos={photos}
							/>
						</div>
						<ModalGateway>
							{viewerIsOpen ? (
								<Modal onClose={closeLightbox}>
									<Carousel
										currentIndex={currentImage}
										views={photos.map(img => {

											let res = {
												src: img.src,
												width: img.width - img.width * 0.3,
												height: img.height - img.height * 0.5
											}

											// console.log(res);

											return res;
										})}
									/>
								</Modal>
							) : null}
						</ModalGateway>
					</div>
				)}
			</Drawer>
		</PageContainer>
	);
};

export default connect(({ user }) => ({
	currentUser: user.currentUser,
}))(Order);
