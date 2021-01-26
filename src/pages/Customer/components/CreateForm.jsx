import React, { useEffect, useRef } from 'react';
import {
	ModalForm,
	ProFormText,
	ProFormTextArea,
	ProFormRadio,
} from '@ant-design/pro-form';
import { useIntl, FormattedMessage } from 'umi';

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
	}

	useEffect(() => {
		resetFields();
	});

	return (
		<ModalForm
			formRef={formRef}
			title={intl.formatMessage({
				id: 'pages.customer.createForm.newCustomer',
				defaultMessage: 'New Customer',
			})}
			layout="horizontal"
			width="400px"
			visible={props.visible}
			onVisibleChange={(state) => {
				if (!state) {
					props.visibleChange()
				}
			}}
			onFinish={(value) => {
				props.onFinish(value);
			}}
		>
			<ProFormText
				name="name"
				label={intl.formatMessage({
					id: 'pages.customer.Form.customerName.nameLabel',
					defaultMessage: 'Name',
				})}
				rules={[
					{
						required: true,
						message: (
							<FormattedMessage
								id="pages.customer.Form.customerName.nameRules"
								defaultMessage="Name required!"
							/>
						),
					},
				]}
			/>
			<ProFormText
				name="phone_number"
				label={intl.formatMessage({
					id: 'pages.customer.Form.customerPhone.phoneLabel',
					defaultMessage: 'Phone number',
				})}
				rules={[
					{
						required: true,
						message: (
							<FormattedMessage
								id="pages.customer.Form.customerPhone.phoneRules"
								defaultMessage="Phone number required!"
							/>
						),
					},
				]}
			/>
			<ProFormTextArea
				name="address"
				label={intl.formatMessage({
					id: 'pages.customer.Form.customerAddress.addressLabel',
					defaultMessage: 'Address',
				})}
				rules={[
					{
						required: true,
						message: (
							<FormattedMessage
								id="pages.customer.Form.customerAddress.addressRules"
								defaultMessage="Name required!"
							/>
						),
					},
				]}
			/>
			<ProFormRadio.Group
				name="type"
				label={intl.formatMessage({
					id: 'pages.customer.Form.customerType.typeLabel',
					defaultMessage: 'Customer type',
				})}
				rules={[
					{
						required: true,
						message: (
							<FormattedMessage
								id="pages.customer.Form.customerType.typeRules"
								defaultMessage="Customer type required!"
							/>
						),
					},
				]}
				options={[
					{
						value: 'casual',
						label: intl.formatMessage({
							id: 'pages.customer.Form.customerType.casualType',
							defaultMessage: 'Casual',
						}),
					},
					{
						value: 'frecuente',
						label: intl.formatMessage({
							id: 'pages.customer.Form.customerType.frequentType',
							defaultMessage: 'Frequent',
						}),
					},
				]}
			/>
		</ModalForm>
	);
};

export default CreateForm;
