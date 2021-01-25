import React from 'react';
import { Modal } from 'antd';
import {
	ModalForm,
	ProFormText,
	ProFormTextArea,
	ProFormRadio,
} from '@ant-design/pro-form';
import { useIntl, FormattedMessage } from 'umi';

const CreateForm = (props) => {
	const intl = useIntl();

	return (
		<ModalForm
			title={intl.formatMessage({
				id: 'pages.customer.updateForm.newCustomer',
				defaultMessage: 'New/Update Customer',
			})}
			layout="horizontal"
			width="400px"
			visible={props.visible}
			onVisibleChange={(state) => {
				if (!state) {
					props.visibleChange()
				}
			}}
			onFinish={(value) => props.onFinish(value)}
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
					id: 'pages.customer.updateForm.customerName.phoneLabel',
					defaultMessage: 'Name',
				})}
				width="md"
				rules={[
					{
						required: true,
						message: (
							<FormattedMessage
								id="pages.customer.Form.customerName.phoneRules"
								defaultMessage="Name required!"
							/>
						),
					},
				]}
			/>
			<ProFormTextArea
				name="address"
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
			<ProFormRadio.Group
				name="type"
				label={intl.formatMessage({
					id: 'pages.customer.updateForm.customerProps.typeLabel',
					defaultMessage: 'Customer type',
				})}
				rules={[
					{
						required: true,
						message: (
							<FormattedMessage
								id="pages.customer.Form.customerName.typeRules"
								defaultMessage="Customer type required!"
							/>
						),
					},
				]}
				options={[
					{
						value: 'casual',
						label: 'Casual',
					},
					{
						value: 'frecuente',
						label: 'Frecuente',
					},
				]}
			/>
		</ModalForm>
	);
};

export default CreateForm;
