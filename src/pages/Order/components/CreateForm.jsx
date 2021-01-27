import React, { useEffect, useRef } from 'react';
import {
	ModalForm,
	ProFormText,
	ProFormTextArea,
	ProFormRadio,
} from '@ant-design/pro-form';
import { useIntl, FormattedMessage } from 'umi';
import JoditEditor from "jodit-react";

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
				id: 'pages.order.Form.newOrder',
				defaultMessage: 'New Order',
			})}
			layout="horizontal"
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
					id: 'pages.order.updateForm.orderName.nameLabel',
					defaultMessage: 'Name',
				})}
				width="md"
				rules={[
					{
						required: true,
						message: (
							<FormattedMessage
								id="pages.order.Form.orderName.nameRules"
								defaultMessage="Name required!"
							/>
						),
					},
				]}
			/>
			<ProFormText
				name="phone_number"
				label={intl.formatMessage({
					id: 'pages.order.updateForm.orderName.phoneLabel',
					defaultMessage: 'Name',
				})}
				width="md"
				rules={[
					{
						required: true,
						message: (
							<FormattedMessage
								id="pages.order.Form.orderName.phoneRules"
								defaultMessage="Name required!"
							/>
						),
					},
				]}
			/>
			<ProFormTextArea
				name="address"
				label={intl.formatMessage({
					id: 'pages.order.updateForm.orderName.addressLabel',
					defaultMessage: 'Address',
				})}
				width="md"
				rules={[
					{
						required: true,
						message: (
							<FormattedMessage
								id="pages.order.Form.orderName.addressRules"
								defaultMessage="Name required!"
							/>
						),
					},
				]}
			/>
			<ProFormRadio.Group
				name="type"
				label={intl.formatMessage({
					id: 'pages.order.updateForm.orderProps.typeLabel',
					defaultMessage: 'Customer type',
				})}
				rules={[
					{
						required: true,
						message: (
							<FormattedMessage
								id="pages.order.Form.orderName.typeRules"
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
