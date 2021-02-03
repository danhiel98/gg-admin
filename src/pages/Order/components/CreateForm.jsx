import React, { useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import ProForm, {
	ModalForm,
	ProFormText,
	ProFormSelect,
	ProFormDatePicker,
	ProFormDigit,
} from '@ant-design/pro-form';
import { useIntl, FormattedMessage } from 'umi';
import 'jodit';
import 'jodit/build/jodit.min.css';
import JoditEditor from 'jodit-react';
import ImageUploader from 'react-images-upload';
import { queryCustomerSelect } from '../../Customer/service';

const CreateForm = (props) => {
	const formRef = useRef();
	const editorRef = useRef();
	const intl = useIntl();
	const [content, setContent] = useState('');
	const [images, setImages] = useState([]);
	const [params, setParams] = useState({});

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

	const onDrop = (pictureFiles, pictureDataURLs) => {
		setImages(pictureFiles);
	};

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
				console.log(value);
				return;
				if (content.innerText === '') {
					message.error('¡Debe introducir una descripción!');
					return;
				}

				props.onFinish({ ...value, description: content.innerHTML }, {images});
			}}
			width="lg"
		>
			<ProForm.Group style={{ textAlign: 'center' }}>
				<ProFormText
					name="title"
					label={intl.formatMessage({
						id: 'pages.order.Form.orderTitle.orderTitleLabel',
						defaultMessage: 'Order Title',
					})}
					width="lg"
					rules={[
						{
							required: true,
							message: (
								<FormattedMessage
									id="pages.order.Form.orderTitle.orderTitleRules"
									defaultMessage="Title required!"
								/>
							),
						},
					]}
				/>
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
					// options={[
					// 	{
					// 		value: 'juan',
					// 		label: 'Juan Argueta',
					// 	},
					// 	{
					// 		value: 'carlos',
					// 		label: 'Carlos Orellana',
					// 	},
					// 	{
					// 		value: 'marla',
					// 		label: 'Marla Amado',
					// 	},
					// ]}
					request={() => { queryCustomerSelect(params) }}
					width="md"
					name="customer_ref"
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
			</ProForm.Group>
			<ProForm.Group style={{ textAlign: 'center' }}>
				<ProFormDatePicker
					fieldProps={{
						inputReadOnly: true,
					}}
					width="70px"
					required
					name="received_at"
					label={intl.formatMessage({
						id: 'pages.order.Form.receivedDate.receivedDateLabel',
						defaultMessage: 'Received Date',
					})}
					rules={[
						{
							required: true,
							message: (
								<FormattedMessage
									id="pages.order.Form.receivedDate.receivedDateRules"
									defaultMessage="Enter the received date!"
								/>
							),
						},
					]}
				/>
				<ProFormDatePicker
					fieldProps={{
						inputReadOnly: true,
					}}
					required
					name="deadline"
					width="70px"
					label={intl.formatMessage({
						id: 'pages.order.Form.deadline.deadlineLabel',
						defaultMessage: 'Deadline',
					})}
					rules={[
						{
							required: true,
							message: (
								<FormattedMessage
									id="pages.order.Form.deadline.deadlineRules"
									defaultMessage="Enter the deadline!"
								/>
							),
						},
					]}
				/>
				<ProFormDigit
					label={intl.formatMessage({
						id: 'pages.order.Form.total.totalLabel',
						defaultMessage: 'Total',
					})}
					required
					name="total"
					width="xs"
					min={1}
					max={10000}
					fieldProps={{
						formatter: (value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
						parser: (value) => value.replace(/\$\s?|(,*)/g, ''),
						step: 0.01,
					}}
					rules={[
						{
							required: true,
							message: (
								<FormattedMessage
									id="pages.order.Form.total.totalRules"
									defaultMessage="Total amount is required!"
								/>
							),
						},
					]}
				/>
				<ProFormDigit
					label={intl.formatMessage({
						id: 'pages.order.Form.firstPayment.firstPaymentLabel',
						defaultMessage: 'Payment',
					})}
					required
					name="first_payment"
					width="xs"
					min={1}
					max={10000}
					fieldProps={{
						formatter: (value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
						parser: (value) => value.replace(/\$\s?|(,*)/g, ''),
						step: 0.01,
					}}
					rules={[
						{
							required: true,
							message: (
								<FormattedMessage
									id="pages.order.Form.firstPayment.firstPaymentRules"
									defaultMessage="Payment amount required!"
								/>
							),
						},
					]}
				/>
			</ProForm.Group>
			{/* <ProForm.Group>
			</ProForm.Group> */}
			<ProForm.Group style={{ textAlign: 'center' }}>
				<ProFormSelect
					required
					mode="tags"
					formItemProps={
						{
							// requiredMark: 'optional',
						}
					}
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
					name="item_types"
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
			<JoditEditor
				ref={editorRef}
				value={content.innerHTML}
				config={{
					enableDragAndDropFileToEditor: true,
					readonly: false,
					language: 'es',
					buttons: [
						'fullsize',
						'|',
						'paragraph',
						'fontsize',
						'font',
						'|',
						'bold',
						'italic',
						'strikethrough',
						'brush',
						'eraser',
						'|',
						'ul',
						'ol',
						'align',
						'|',
						'link',
						'hr',
						'table',
						'|',
						'undo',
						'redo',
						'selectall',
						'|',
						'preview',
					],
					buttonsMD: [
						'fullsize',
						'|',
						'paragraph',
						'fontsize',
						'font',
						'|',
						'bold',
						'italic',
						'strikethrough',
						'brush',
						'eraser',
						'|',
						'ul',
						'ol',
						'align',
						'|',
						'link',
						'hr',
						'table',
						'|',
						'undo',
						'redo',
						'selectall',
						'|',
						'preview',
					],
					buttonsXS: [
						'fullsize',
						'|',
						'paragraph',
						'fontsize',
						'font',
						'|',
						'bold',
						'italic',
						'strikethrough',
						'brush',
						'eraser',
						'|',
						'ul',
						'ol',
						'align',
						'|',
						'link',
						'hr',
						'table',
						'|',
						'undo',
						'redo',
						'|',
						'preview',
					],
					uploader: {
						insertImageAsBase64URI: true,
					},
				}}
				onBlur={(ev) => {
					setContent(ev.target);
				}}
			/>
			<ProForm.Group style={{ textAlign: 'center' }}>
				<ImageUploader
					style={{ width: 600 }}
					withIcon={true}
					buttonText="Adjuntar imágenes"
					label={``}
					onChange={onDrop}
					imgExtension={['.jpg', '.jpeg', '.gif', '.png', '.gif']}
					withPreview={true}
					maxFileSize={10242880}
				/>
			</ProForm.Group>
		</ModalForm>
	);
};

export default CreateForm;
