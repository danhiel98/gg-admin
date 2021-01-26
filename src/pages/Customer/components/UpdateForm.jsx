import React, { useRef, useEffect } from 'react';
import { Modal } from 'antd';
import ProForm, {
	ModalForm,
	ProFormText,
	ProFormTextArea,
	ProFormRadio,
} from '@ant-design/pro-form';
import { useIntl, FormattedMessage } from 'umi';

const UpdateForm = (props) => {
	const formRef = useRef();
	const intl = useIntl();

	useEffect(() => {
		formRef.current.setFieldsValue({
			name: props.record.name,
			phone_number: props.record.phone_number,
			address: props.record.address,
			type: props.record.type,
		});
	});

	const sendData = () => {
		formRef.current.validateFields()
		.then((values) => {
			props.onFinish(values);
		})
		.catch(() => {
			return;
		})
	}

	return (
		<ProForm
			onKeyDown={(ev) => {
				// Enviar datos si se presiona enter en cualquier elemento del modal que no sea un textarea
				if (ev.keyCode === 13 && ev.target.type != 'textarea') {
					sendData();
				}
			}}
			formRef={formRef}
			submitter={{
				render: (_, dom) => {
					dom.pop()
				}
			}}
		>
			<Modal
				title={intl.formatMessage({
					id: 'pages.customer.updateForm.updateCustomer',
					defaultMessage: 'Update Customer',
				})}
				destroyOnClose
				width="400px"
				visible={props.visible}
				onCancel={() => props.onCancel()}
				okButtonProps={() => {

				}}
				onOk={() => {
					sendData();
				}}

				onFinish={(value) => props.onFinish(value)}
			>
				<ProFormText
					name="name"
					label={intl.formatMessage({
						id: 'pages.customer.updateForm.customerName.nameLabel',
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
						id: 'pages.customer.updateForm.customerName.phoneLabel',
						defaultMessage: 'Name',
					})}
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
			</Modal>
		</ProForm>
	);
};

export default UpdateForm;
