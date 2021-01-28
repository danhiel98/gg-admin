import React, { useEffect, useRef } from 'react';
import ProForm, {
	ModalForm,
	ProFormText,
	ProFormSelect,
	ProFormDatePicker,
	ProFormDigit,
} from '@ant-design/pro-form';
import { useIntl, FormattedMessage } from 'umi';
import JoditEditor from 'jodit-react';

const CreateForm = (props) => {
	const formRef = useRef();
	const intl = useIntl();

	const resetFields = () => {
		formRef.current.setFieldsValue({
			name: '',
			phone_number: '',
			address: '',
			type: '',
		});
	};

	useEffect(() => {
		resetFields();
	});

	return (
		<ModalForm
			formRef={formRef}
			title={intl.formatMessage({
				id: 'pages.order.Form.newOrder',
				defaultMessage: 'New Order',
			})}
			layout="horizontal"
			visible={props.visible}
			onVisibleChange={(state) => {
				if (!state) {
					props.visibleChange();
				}
			}}
			onFinish={(value) => {
				props.onFinish(value);
			}}
		>
			<ProForm.Group style={{ textAlign: 'center' }}>
				<ProFormText
					name="title"
					label={intl.formatMessage({
						id: 'pages.order.Form.orderTitle.titleLabel',
						defaultMessage: 'Order Title',
					})}
					width="md"
					rules={[
						{
							required: true,
							message: (
								<FormattedMessage
									id="pages.order.Form.orderTitle.titleRules"
									defaultMessage="Title required!"
								/>
							),
						},
					]}
				/>
			</ProForm.Group>
			<ProForm.Group>
				<ProFormSelect // Se deben obtener los primeros 5 últimos clientes insertados, sino que busque
					formItemProps={
						{
							// requiredMark: 'optional'
						}
					}
					fieldProps={{
						onSearch: (val) => console.log(`Search: ${val}`),
					}}
					showSearch
					options={[
						{
							value: 'juan',
							label: 'Juan Argueta',
						},
						{
							value: 'carlos',
							label: 'Carlos Orellana',
						},
						{
							value: 'marla',
							label: 'Marla Amado',
						},
					]}
					width="md"
					name="useMode"
					label={intl.formatMessage({
						id: 'pages.order.Form.customer.customerLabel',
						defaultMessage: 'Customer',
					})}
					rules={[
						{
							required: true,
							message: (
								<FormattedMessage
									id="pages.order.Form.customer.customerRules"
									defaultMessage="You must select a customer!"
								/>
							),
						},
					]}
				/>
				<ProFormDatePicker
					fieldProps={{
						inputReadOnly: 'true',
					}}
					width="70px"
					required
					name="received_at"
					label={intl.formatMessage({
						id: 'pages.order.Form.receivedDate.receivedDateLabel',
						defaultMessage: 'Received Date',
					})}
				/>
			</ProForm.Group>
			<ProForm.Group>
				<ProFormDatePicker
					fieldProps={{
						inputReadOnly: 'true',
					}}
					required
					name="deadline"
					width="70px"
					label={intl.formatMessage({
						id: 'pages.order.Form.deadline.deadlineLabel',
						defaultMessage: 'Deadline',
					})}
				/>
				<ProFormDigit
					label={intl.formatMessage({
						id: 'pages.order.Form.total.totalLabel',
						defaultMessage: 'Total',
					})}
					name="total"
					width="xs"
					min={1}
					max={10000}
					fieldProps={{
						formatter: (value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
						parser: (value) => value.replace(/\$\s?|(,*)/g, ''),
						step: 0.01,
					}}
				/>
				<ProFormDigit
					label={intl.formatMessage({
						id: 'pages.order.Form.firstPayment.firstPaymentLabel',
						defaultMessage: 'Payment',
					})}
					name="first_payment"
					width="xs"
					min={1}
					max={10000}
					fieldProps={{
						formatter: (value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
						parser: (value) => value.replace(/\$\s?|(,*)/g, ''),
						step: 0.01,
					}}
				/>
			</ProForm.Group>
			<ProForm.Group style={{ textAlign: 'center' }}>
				<ProFormSelect
					required
					mode="tags"
					formItemProps={{
						requiredMark: 'optional',
					}}
					options={[
						{
							value: 'camisas',
							label: 'Camisas',
						},
						{
							value: 'gorras',
							label: 'Gorras',
						},
						{
							value: 'tazas',
							label: 'Tazas',
						},
						{
							value: 'azulejos',
							label: 'Azulejos',
						},
						{
							value: 'uniformes',
							label: 'Uniformes',
						},
					]}
					width="md"
					name="itemTypes"
					label={intl.formatMessage({
						id: 'pages.order.Form.itemTypes.itemTypesLabel',
						defaultMessage: 'Item Types',
					})}
					rules={[
						{
							required: true,
							message: (
								<FormattedMessage
									id="pages.order.Form.itemTypes.itemTypesRules"
									defaultMessage="Select at least one item type!"
								/>
							),
						},
					]}
				/>
			</ProForm.Group>
		</ModalForm>
	);
};

export default CreateForm;
