import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer, Radio } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea, ProFormRadio } from '@ant-design/pro-form';
import ProDescriptions from '@ant-design/pro-descriptions';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { queryOrder, updateOrder, addOrder, removeOrder } from './service';
import { currencyFormat, dateFromTimestamp } from '@/utils/dataFunctions';

const handleAdd = async (fields) => {
	const hide = message.loading('Agregando');

	try {
		await addOrder({ ...fields });
		hide();
		message.success('¡Registro agregado correctamente!');
		return true;
	} catch (error) {
		hide();
		message.error('Error al intentar agregar el registro');
		return false;
	}
};
/**
 * 更新节点
 *
 * @param fields
 */

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
/**
 * 删除节点
 *
 * @param selectedRows
 */

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

const Order = () => {
	const [createModalVisible, handleModalVisible] = useState(false); // Modal de registro
	const [updateModalVisible, handleUpdateModalVisible] = useState(false); // Modal de edición
	const [showDetail, setShowDetail] = useState(false); // Modal de detalle

	const actionRef = useRef();
	const [currentRow, setCurrentRow] = useState(); // Registro seleccionado
	const [selectedRowsState, setSelectedRows] = useState([]); // No sé, xd

	const intl = useIntl();
	const columns = [
		{
			title: <FormattedMessage id="pages.order.titleAddress" defaultMessage="Title" />,
			dataIndex: 'title',
			render: (dom, entity) => {
				return (
					<a
						onClick={() => {
							setCurrentRow(entity);
							setShowDetail(true);
						}}
					>
						{dom}
					</a>
				);
			},
		},
		{
			title: (
				<FormattedMessage
					id="pages.order.updateForm.customerName.nameLabel"
					defaultMessage="Nombre del cliente"
				/>
			),
			dataIndex: 'customer',
			tip: 'Nombre de cliente',
			render: (dom, entity) => {
				return (
					<a
						onClick={() => {
							setCurrentRow(entity);
							setShowDetail(true);
						}}
					>
						{dom}
					</a>
				);
			},
		},
		{
			title: (
				<FormattedMessage id="pages.order.titleType" defaultMessage="Order Status" />
			),
			dataIndex: 'status',
			hideInForm: true,
			valueEnum: {
				pendiente: {
					text: (
						<FormattedMessage
							id="pages.order.nameType.pending"
							defaultMessage="Pending"
						/>
					),
					status: 'Default',
				},
				entregado: {
					text: (
						<FormattedMessage
							id="pages.order.nameType.delivered"
							defaultMessage="Delivered"
						/>
					),
					status: 'Success',
				},
				cancelado: {
					text: (
						<FormattedMessage
							id="pages.order.nameType.cancelled"
							defaultMessage="Cancelled"
						/>
					),
					status: 'Success',
				}
			},
		},
		{
			title: (
				<FormattedMessage
					id="pages.order.titleDeadline"
					defaultMessage="Deadline"
				/>
			),
			dataIndex: 'deadline',
			render: (value, record) => {
				return (
					<strong>{dateFromTimestamp(value)}</strong>
				);
			},
		},
		{
			title: (
				<FormattedMessage id="pages.order.ordersAmount" defaultMessage="Total" />
			),
			sorter: true,
			dataIndex: 'total',
			render: (value, record) => {
				return (
					<strong>{currencyFormat(value)}</strong>
				);
			}
		},
		{
			title: (
				<FormattedMessage id="pages.order.ordersAmount" defaultMessage="Remaining" />
			),
			sorter: true,
			dataIndex: 'remaining',
			render: (value, record) => {
				return (
					<strong>{currencyFormat(value)}</strong>
				);
			}
		},
		{
			title: <FormattedMessage id="pages.order.titleOption" defaultMessage="Option" />,
			dataIndex: 'option',
			valueType: 'option',
			render: (_, record) => [
				<a
					key="edit"
					onClick={() => {
						setCurrentRow(record);
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
		},
	];
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
					<Button
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
				request={(params, sorter, filter) => queryOrder({ ...params, sorter, filter })}
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
				onFinish={async (value) => {
					const success = await handleAdd(value);

					if (success) {
						handleModalVisible(false);

						if (actionRef.current) {
							actionRef.current.reload();
						}
						return  true;
					}
				}}
			/>
			<UpdateForm
				visible={updateModalVisible}
				visibleChange={() => {
					handleUpdateModalVisible(!updateModalVisible);
					setCurrentRow(undefined);
				}}
				record={currentRow || {}}
				onFinish={async (value) => {
					const success = await handleUpdate(value, currentRow);

					if (success) {
						handleUpdateModalVisible(false);
						setCurrentRow(undefined);

						if (actionRef.current) {
							actionRef.current.reload();
						}
					}
				}}
			/>

			<Drawer
				width={600}
				visible={showDetail && currentRow}
				onClose={() => {
					setCurrentRow(undefined);
					setShowDetail(false);
				}}
				closable={true}
			>
				{currentRow?.name && (
					<ProDescriptions
						column={2}
						title={currentRow?.name}
						request={async () => ({
							data: currentRow || {},
						})}
						params={{
							id: currentRow?.name,
						}}
						columns={columns}
					/>
				)}
			</Drawer>
		</PageContainer>
	);
};

export default Order;
