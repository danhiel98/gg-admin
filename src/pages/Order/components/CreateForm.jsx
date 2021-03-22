import React, { useEffect, useRef, useState } from 'react';
import { message, Spin } from 'antd';
import ProForm, {
	ModalForm,
	ProFormText,
	ProFormSelect,
	ProFormDatePicker,
	ProFormDigit,
} from '@ant-design/pro-form';

import { useIntl, FormattedMessage } from 'umi';
// import 'jodit';
// import 'jodit/build/jodit.min.css';
import JoditEditor from '@/components/JoditEditor';
import ImageUploader from 'react-images-upload';
import { queryCustomerSelect } from '../../Customer/service';
import { stringToHTML } from '@/utils/utils';

const dateFormat = 'DD-MM-YYYY';

function getConfig(props) {
	let config = {
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
	}

	return config;
}

const CreateForm = (props) => {
	const formRef = useRef();
	const editorRef = useRef();
	const intl = useIntl();
	const [content, setContent] = useState('');
	const [customers, setCustomers] = useState([]);
	const [loadingCustomers, setLoadingCustomers] = useState(false);
	const [images, setImages] = useState([]);

	const resetFields = () => {
		// formRef.current.setFieldsValue({
		// 	title: null,
		// 	customer_id: null,
		// 	total: null,
		// 	first_payment: null,
		// 	received_at: null,
		// 	deadline: null,
		// 	item_types: null
		// });
		// formRef.current.setFieldsValue({
		// 	title: 'Order Title',
		// 	customer_id: customers.length > 0 ? customers[0].value : null,
		// 	total: 100,
		// 	first_payment: 50,
		// 	received_at: '2020-02-09',
		// 	deadline: '2020-02-20',
		// 	item_types: ['Azulejos', 'Gorras']
		// });
	};

	useEffect(() => {
		resetFields();
	});

	useEffect(() => {
		if (props.visible) {
			setLoadingCustomers(true);
			queryCustomerSelect()
				.then((data) => {
					setCustomers(data);
				})
				.finally(() => setLoadingCustomers(false));
		}
	}, [props.visible]);

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
			width
			layout="horizontal"
			visible={props.visible}
			onVisibleChange={(state) => {
				if (!state) {
					// editorRef.destruct();
					props.visibleChange();
				}
			}}
			onFinish={(value) => {
				let html = stringToHTML(content);

				try {
					if (!html.innerText) throw new Error('¡Debe introducir una descripción!');
					if (value.total < value.first_payment) throw new Error('¡El total no debe ser menor al adelanto');

					props.onFinish({ ...value, description: html.innerHTML }, { images });
				} catch (error) {
					message.error(error.message);
				}

			}}
		>
			<ProForm.Group style={{ textAlign: 'center' }}>
				<ProFormText
					name="title"
					label={intl.formatMessage({
						id: 'pages.order.Form.orderTitle.orderTitleLabel',
						defaultMessage: 'Order Title',
					})}
					placeholder={intl.formatMessage({
						id: 'pages.order.Form.orderTitle.orderTitleLabel',
						defaultMessage: 'Order Title',
					})}
					width="md"
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
						// onSearch: handleSearch,
						optionFilterProp: 'children',
						filterOption: (input, option) =>
							option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
					}}
					notFoundContent={loadingCustomers ? <Spin size="small" /> : null}
					showSearch
					options={customers}
					width="md"
					name="customer_id"
					label={intl.formatMessage({
						id: 'pages.order.Form.customer.customerLabel',
						defaultMessage: 'Customer',
					})}
					placeholder={intl.formatMessage({
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
						format: dateFormat
					}}
					width="70px"
					required
					name="received_at"
					label={intl.formatMessage({
						id: 'pages.order.Form.receivedDate.receivedDateLabel',
						defaultMessage: 'Received Date',
					})}
					placeholder={intl.formatMessage({
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
						format: dateFormat
					}}
					required
					name="deadline"
					width="70px"
					label={intl.formatMessage({
						id: 'pages.order.Form.deadline.deadlineLabel',
						defaultMessage: 'Deadline',
					})}
					placeholder={intl.formatMessage({
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
					placeholder={intl.formatMessage({
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
					placeholder={intl.formatMessage({
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
						{
							value: 'lanyards',
							label: 'Lanyards',
						},
					]}
					width="md"
					name="item_types"
					label={intl.formatMessage({
						id: 'pages.order.Form.itemTypes.itemTypesLabel',
						defaultMessage: 'Item Types',
					})}
					placeholder={intl.formatMessage({
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
				value={content ? content.innerHTML : '' }
				config={getConfig()}
				onBlur={(data) => setContent(data)}
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
