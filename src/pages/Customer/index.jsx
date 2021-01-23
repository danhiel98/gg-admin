import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer } from 'antd';
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
		message.success('添加成功');
		return true;
	} catch (error) {
		hide();
		message.error('添加失败请重试！');
		return false;
	}
};
/**
 * 更新节点
 *
 * @param fields
 */

const handleUpdate = async (fields) => {
	const hide = message.loading('正在配置');

	try {
		await updateCustomer({
			name: fields.name,
			desc: fields.desc,
			key: fields.key,
		});
		hide();
		message.success('配置成功');
		return true;
	} catch (error) {
		hide();
		message.error('配置失败请重试！');
		return false;
	}
};
/**
 * 删除节点
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRows) => {
	const hide = message.loading('正在删除');
	if (!selectedRows) return true;

	try {
		await removeCustomer({
			key: selectedRows.map((row) => row.key),
		});
		hide();
		message.success('删除成功，即将刷新');
		return true;
	} catch (error) {
		hide();
		message.error('删除失败，请重试');
		return false;
	}
};

const TableList = () => {
	const [createModalVisible, handleModalVisible] = useState(false);

	const [updateModalVisible, handleUpdateModalVisible] = useState(false);
	const [showDetail, setShowDetail] = useState(false);
	const actionRef = useRef();
	const [currentRow, setCurrentRow] = useState();
	const [selectedRowsState, setSelectedRows] = useState([]);

	const intl = useIntl();
	const columns = [
		{
			title: (
				<FormattedMessage
					id="pages.searchTable.updateForm.customerName.nameLabel"
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
			title: (
				<FormattedMessage id="pages.searchTable.titleAddress" defaultMessage="Dirección" />
			),
			dataIndex: 'address',
			valueType: 'textarea',
		},
		{
			title: (
				<FormattedMessage
					id="pages.searchTable.titlePhoneNumber"
					defaultMessage="PhoneNumber"
				/>
			),
			dataIndex: 'main_phone_number',
			sorter: true,
			hideInForm: true,
		},
		{
			title: (
				<FormattedMessage id="pages.searchTable.titleType" defaultMessage="Customer Type" />
			),
			dataIndex: 'type',
			hideInForm: true,
			valueEnum: {
				casual: {
					text: (
						<FormattedMessage
							id="pages.searchTable.nameType.casual"
							defaultMessage="Casual"
						/>
					),
					status: 'Default',
				},
				frecuente: {
					text: (
						<FormattedMessage
							id="pages.searchTable.nameType.frequent"
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
					id="pages.searchTable.ordersAmount"
					defaultMessage="Orders Amount"
				/>
			),
			sorter: true,
			dataIndex: 'orders_amount',
			valueType: 'number'
		},
		{
			title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Título" />,
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
					<FormattedMessage
						id="pages.searchTable.edit"
						defaultMessage="Edit"
					/>
				</a>,
				<a key="delete"
					href="https://procomponents.ant.design/">
					<FormattedMessage
						id="pages.searchTable.delete"
						defaultMessage="Delete"
					/>
				</a>,
			],
		},
	];
	return (
		<PageContainer>
			<ProTable
				headerTitle={intl.formatMessage({
					id: 'pages.searchTable.title',
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
						<FormattedMessage id="pages.searchTable.new" defaultMessage="新建" />
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
							<FormattedMessage
								id="pages.searchTable.chosen"
								defaultMessage="已选择"
							/>{' '}
							<a
								style={{
									fontWeight: 600,
								}}
							>
								{selectedRowsState.length}
							</a>{' '}
							<FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
							&nbsp;&nbsp;
							<span>
								<FormattedMessage
									id="pages.searchTable.totalServiceCalls"
									defaultMessage="服务调用次数总计"
								/>{' '}
								{selectedRowsState.reduce((pre, item) => pre + item.callNo, 0)}{' '}
								<FormattedMessage
									id="pages.searchTable.tenThousand"
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
							id="pages.searchTable.batchDeletion"
							defaultMessage="批量删除"
						/>
					</Button>
					<Button type="primary">
						<FormattedMessage
							id="pages.searchTable.batchApproval"
							defaultMessage="批量审批"
						/>
					</Button>
				</FooterToolbar>
			)}
			<ModalForm
				title={intl.formatMessage({
					id: 'pages.searchTable.createForm.newCustomer',
					defaultMessage: 'New Customer',
				})}
				layout='horizontal'
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
						id: 'pages.searchTable.updateForm.customerName.label',
						defaultMessage: 'Name',
					})}
					width="md"
					rules={[
						{
							required: true,
							message: (
								<FormattedMessage
									id="pages.searchTable.updateForm.customerName.rules"
									defaultMessage="Name required!"
								/>
							),
						},
					]}
				/>
				<ProFormTextArea
					name="desc"
					label={intl.formatMessage({
						id: 'pages.searchTable.updateForm.customerName.addressLabel',
						defaultMessage: 'Address'
					})}
					width="md"
					rules={[
						{
							required: true,
							message: (
								<FormattedMessage
									id="pages.searchTable.Form.customerName.nameRules"
									defaultMessage="Name required!"
								/>
							),
						},
					]}
				/>
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
