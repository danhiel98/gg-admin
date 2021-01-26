import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal, Button, message, Drawer } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import {
	queryCustomer,
	updateCustomer,
	addCustomer,
	removeCustomer,
	queryAvailableDelete,
} from './service';

const { confirm } = Modal;

/**
 * Add customer
 *
 * @param fields
 */

const handleAdd = async (fields) => {
	const hide = message.loading('Cargando');

	try {
		await addCustomer({ ...fields });
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
 * Update customer
 *
 * @param fields
 * @param record
 */

const handleUpdate = async (fields, record) => {
	const hide = message.loading('Cargando');

	try {
		await updateCustomer(fields, record);
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
 * Remove customer
 *
 * @param record
 */

const handleRemove = async (record) => {
	const hide = message.loading('Cargando');

	try {
		await removeCustomer(record);
		hide();
		message.success('¡Cliente eliminado correctamente!');
		return true;
	} catch (error) {
		hide();
		message.error('No se pudo eliminar al cliente');
		return false;
	}
};

const verifyDelete = async (record) => {
	let available = false;
	const hide = message.loading('Verificando...');

	try {
		available = await queryAvailableDelete(record.key);
		hide();
	} catch (error) {
		message.error('Ocurrió un error inesperado al eliminar el cliente');
	}

	return available;
};

const TableList = () => {
	const [createModalVisible, handleModalVisible] = useState(false); // Modal de registro
	const [updateModalVisible, handleUpdateModalVisible] = useState(false); // Modal de edición
	const [showDetail, setShowDetail] = useState(false); // Modal de detalle

	const actionRef = useRef();
	const [currentRow, setCurrentRow] = useState(); // Registro seleccionado
	const [selectedRowsState, setSelectedRows] = useState([]);

	const intl = useIntl();
	const columns = [
		{
			title: (
				<FormattedMessage id="pages.customer.titleName" defaultMessage="Customer Name" />
			),
			dataIndex: 'name',
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
			title: <FormattedMessage id="pages.customer.titleAddress" defaultMessage="Dirección" />,
			dataIndex: 'address',
			valueType: 'textarea',
		},
		{
			title: (
				<FormattedMessage
					id="pages.customer.titlePhoneNumber"
					defaultMessage="PhoneNumber"
				/>
			),
			dataIndex: 'phone_number',
			sorter: true,
			hideInForm: true,
		},
		{
			title: (
				<FormattedMessage id="pages.customer.titleType" defaultMessage="Customer Type" />
			),
			dataIndex: 'type',
			hideInForm: true,
			valueEnum: {
				casual: {
					text: (
						<FormattedMessage
							id="pages.customer.type.casualType"
							defaultMessage="Casual"
						/>
					),
					status: 'Default',
				},
				frecuente: {
					text: (
						<FormattedMessage
							id="pages.customer.type.frequentType"
							defaultMessage="Frequent"
						/>
					),
					status: 'Success',
				},
			},
		},
		{
			title: (
				<FormattedMessage
					id="pages.customer.titleOrdersAmount"
					defaultMessage="Orders Amount"
				/>
			),
			sorter: true,
			dataIndex: 'orders_amount',
			valueType: 'number',
		},
		{
			title: <FormattedMessage id="pages.customer.titleOption" defaultMessage="Título" />,
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
					<FormattedMessage id="pages.customer.edit" defaultMessage="Edit" />
				</a>,
				<a
					key="delete"
					onClick={async () => {
						let available = await verifyDelete(record);

						if (available) {
							confirm({
								title: '¿Está seguro que desea eliminar este cliente?',
								icon: <ExclamationCircleOutlined />,
								content: 'Eliminar información del cliente',
								okText: 'Sí',
								cancelText: 'No',
								onOk: async () => {
									let success = await handleRemove(record);

									if (success) {
										if (actionRef.current) {
											actionRef.current.reload();
										}
										return true;
									}
								},
							});
						}
					}}
				>
					<FormattedMessage id="pages.customer.delete" defaultMessage="Delete" />
				</a>,
			],
		},
	];
	return (
		<PageContainer>
			<ProTable
				headerTitle={intl.formatMessage({
					id: 'pages.customer.title',
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
						<FormattedMessage id="pages.customer.new" defaultMessage="New" />
					</Button>,
				]}
				request={(params, sorter, filter) => queryCustomer({ ...params, sorter, filter })}
				columns={columns}
				rowSelection={{
					onChange: (_, selectedRows) => {
						setSelectedRows(selectedRows);
					},
				}}
			/>
			{/* {selectedRowsState?.length > 0 && (
				<FooterToolbar
					extra={
						<div>
							<FormattedMessage id="pages.customer.chosen" defaultMessage="chosen" />{' '}
							<a
								style={{
									fontWeight: 600,
								}}
							>
								{selectedRowsState.length}
							</a>{' '}
							<FormattedMessage id="pages.customer.item" defaultMessage="item" />
							&nbsp;&nbsp;
							<span>
								<FormattedMessage
									id="pages.customer.totalServiceCalls"
									defaultMessage="Total Number of Service Calls"
								/>{' '}
								{selectedRowsState.reduce((pre, item) => pre + item.callNo, 0)}{' '}
								<FormattedMessage
									id="pages.customer.tenThousand"
									defaultMessage="0000"
								/>
							</span>
						</div>
					}
				>
					<Button
						onClick={async () => {
							await handleRemove(selectedRowsState);
							setSelectedRows([]);
							actionRef.current?.reloadAndRest?.();
						}}
					>
						<FormattedMessage
							id="pages.customer.batchDeletion"
							defaultMessage="Batch Deletion"
						/>
					</Button>
					<Button type="primary">
						<FormattedMessage
							id="pages.customer.batchApproval"
							defaultMessage="Batch Approval"
						/>
					</Button>
				</FooterToolbar>
			)} */}
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
						return true;
					}
				}}
			/>

			<UpdateForm
				visible={updateModalVisible}
				record={currentRow || {}}
				onCancel={() => {
					handleUpdateModalVisible(false);
					if (!showDetail) {
						setCurrentRow(undefined);
					}
				}}
				onFinish={async (value) => {
					const success = await handleUpdate(value, currentRow);

					if (success) {
						handleUpdateModalVisible(false);
						setCurrentRow(undefined);
						if (showDetail) {
							setShowDetail(false);
						}

						if (actionRef.current) {
							actionRef.current.reload();
						}
					}
				}}
			/>

			<Drawer
				placement="bottom"
				visible={showDetail}
				onClose={() => {
					setCurrentRow(undefined);
					setShowDetail(false);
				}}
				closable={false}
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

export default TableList;
