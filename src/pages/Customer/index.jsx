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
import { queryCustomer, updateCustomer, addCustomer, removeCustomer, queryAvailableDelete } from './service';

const handleAdd = async (fields) => {
	const hide = message.loading('Agregando');

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
 * 更新节点
 *
 * @param fields
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
 * 删除节点
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRows) => {
	const hide = message.loading('Cargando');
	if (!selectedRows) return true;

	try {
		await removeCustomer({
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

const verifyDelete = async (record) => {
	const hide = message.loading("Verificando...");

	try {
		let available = await queryAvailableDelete(record.key);
		hide();

		if (available) {

		} else {
			message.warn('Este cliente no se puede eliminar')
		}
	} catch (error) {
		message.error('Ocurrió un error inesperado al eliminar el cliente')
	}
	// this.contratosCliente(record).then((size) => {
	// 	message.destroy();
	// 	if (size === 0) this.confirmEliminar(record);
	// 	else if (size === 1)
	// 		message.error(
	// 			"No se puede eliminar este cliente porque ya tiene contratos"
	// 		);
	// });
};

const TableList = () => {
	const [createModalVisible, handleModalVisible] = useState(false); // Modal de registro
	const [updateModalVisible, handleUpdateModalVisible] = useState(false); // Modal de edición
	const [deleteModalVisible, handleDeleteModalVisible] = useState(false); // Modal para eliminar
	const [showDetail, setShowDetail] = useState(false); // Modal de detalle

	const actionRef = useRef();
	const [currentRow, setCurrentRow] = useState(); // Registro seleccionado
	const [selectedRowsState, setSelectedRows] = useState([]); // No sé, xd

	const intl = useIntl();
	const columns = [
		{
			title: (
				<FormattedMessage
					id="pages.customer.updateForm.customerName.nameLabel"
					defaultMessage="Nombre del cliente"
				/>
			),
			dataIndex: 'name',
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
							id="pages.customer.nameType.casual"
							defaultMessage="Casual"
						/>
					),
					status: 'Default',
				},
				frecuente: {
					text: (
						<FormattedMessage
							id="pages.customer.nameType.frequent"
							defaultMessage="Frequent"
						/>
					),
					status: 'Success',
				},
			},
		},
		{
			title: (
				<FormattedMessage id="pages.customer.ordersAmount" defaultMessage="Orders Amount" />
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
					onClick={() => {
						verifyDelete(record);
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
							<FormattedMessage id="pages.customer.chosen" defaultMessage="已选择" />{' '}
							<a
								style={{
									fontWeight: 600,
								}}
							>
								{selectedRowsState.length}
							</a>{' '}
							<FormattedMessage id="pages.customer.item" defaultMessage="项" />
							&nbsp;&nbsp;
							<span>
								<FormattedMessage
									id="pages.customer.totalServiceCalls"
									defaultMessage="服务调用次数总计"
								/>{' '}
								{selectedRowsState.reduce((pre, item) => pre + item.callNo, 0)}{' '}
								<FormattedMessage
									id="pages.customer.tenThousand"
									defaultMessage="万"
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

			{/* <DeleteModal
				visible={deleteModalVisible}
				visibleChange={() => {

				}}
				record={currentRow}
			/> */}

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

export default TableList;
