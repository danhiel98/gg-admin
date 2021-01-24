import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer, Radio } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import ProDescriptions from '@ant-design/pro-descriptions';
import UpdateForm from './components/UpdateForm';
import { queryCustomer, updateCustomer, addCustomer, removeCustomer } from './service';

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

const handleUpdate = async (fields) => {
	const hide = message.loading('Cargando');

	try {
		await updateCustomer({
			name: fields.name,
			desc: fields.desc,
			key: fields.key,
		});
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

const TableList = () => {
	const [createModalVisible, handleModalVisible] = useState(false); // Modal de registro
	const [updateModalVisible, handleUpdateModalVisible] = useState(false); // Modal de edición
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
			dataIndex: 'main_phone_number',
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
						handleUpdateModalVisible(true);
						setCurrentRow(record);
					}}
				>
					<FormattedMessage id="pages.customer.edit" defaultMessage="Edit" />
				</a>,
				<a
					key="delete"
					onClick={() => {
						console.log('Me quieres eliminar ¿Acaso no sabes quien soy?');
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
			{selectedRowsState?.length > 0 && (
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
			)}
			<ModalForm
				title={intl.formatMessage({
					id: 'pages.customer.updateForm.newCustomer',
					defaultMessage: 'New Customer',
				})}
				layout="horizontal"
				width="400px"
				visible={createModalVisible}
				onVisibleChange={handleModalVisible}
				onFinish={async (value) => {
					const success = await handleAdd(value);

					if (success) {
						handleModalVisible(false);

						if (actionRef.current) {
							actionRef.current.reload();
						}
					}
				}}
			>
				<ProFormText
					name="name"
					label={intl.formatMessage({
						id: 'pages.customer.updateForm.customerName.nameLabel',
						defaultMessage: 'Name',
					})}
					width="md"
					rules={[
						{
							required: true,
							message: (
								<FormattedMessage
									id="pages.customer.updateForm.customerName.nameRules"
									defaultMessage="Name required!"
								/>
							),
						},
					]}
				/>
				<ProFormText
					name="phone"
					label={intl.formatMessage({
						id: 'pages.customer.updateForm.customerName.phoneLabel',
						defaultMessage: 'Name',
					})}
					width="md"
					rules={[
						{
							required: true,
							message: (
								<FormattedMessage
									id="pages.customer.updateForm.customerName.phoneRules"
									defaultMessage="Name required!"
								/>
							),
						},
					]}
				/>
				<ProFormTextArea
					name="desc"
					label={intl.formatMessage({
						id: 'pages.customer.updateForm.customerName.addressLabel',
						defaultMessage: 'Address',
					})}
					width="md"
					rules={[
						{
							required: true,
							message: (
								<FormattedMessage
									id="pages.customer.Form.customerName.addressRules"
									defaultMessage="Name required!"
								/>
							),
						},
					]}
				/>
				<Radio.Group onChange={(x) => console.log(x)}>
					<Radio.Button value="casual">
						<FormattedMessage
							id="pages.customer.Form.radioOption.casual"
							defaultMessage="Casual"
						/>
					</Radio.Button>
					<Radio.Button value="frequent">
						<FormattedMessage
							id="pages.customer.Form.radioOption.frequent"
							defaultMessage="Frequent"
						/>
					</Radio.Button>
				</Radio.Group>
			</ModalForm>
			<UpdateForm
				onSubmit={async (value) => {
					const success = await handleUpdate(value);

					if (success) {
						handleUpdateModalVisible(false);
						setCurrentRow(undefined);

						if (actionRef.current) {
							actionRef.current.reload();
						}
					}
				}}
				onCancel={() => {
					handleUpdateModalVisible(false);
					setCurrentRow(undefined);
				}}
				updateModalVisible={updateModalVisible}
				values={currentRow || {}}
			/>

			<Drawer
				width={600}
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
