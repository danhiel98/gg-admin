import { LockTwoTone, UserOutlined } from '@ant-design/icons';
import { Alert } from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { Link, useIntl, connect, FormattedMessage } from 'umi';
import styles from './index.less';

const LoginMessage = ({ content }) => (
	<Alert
		style={{
			marginBottom: 24,
		}}
		message={content}
		type="error"
		showIcon
		closable
	/>
);

const Login = (props) => {
	const { userLogin = {}, submitting } = props;
	const { status, type: loginType } = userLogin;
	const [type, setType] = useState('account');
	const intl = useIntl();

	const handleSubmit = (values) => {
		const { dispatch } = props;

		dispatch({
			type: 'login/login', // namespace/effect en modelo login
			payload: { ...values, type },
		});
	};

	return (
		<div className={styles.main}>
			<ProForm
				initialValues={{
					autoLogin: true,
				}}
				submitter={{
					render: (_, dom) => dom.pop(),
					submitButtonProps: {
						id: 'pages.login.submit',
						loading: submitting,
						size: 'large',
						style: {
							width: '100%',
						},
					},
				}}
				onFinish={(values) => {
					handleSubmit(values);
				}}
			>
				{status === 'error' && type === 'account' && !submitting && (
					<LoginMessage
						content={intl.formatMessage({
							id: 'pages.login.accountLogin.errorMessage',
							defaultMessage: 'Incorrect username/password',
						})}
					/>
				)}

				<ProFormText
					name="userName"
					fieldProps={{
						size: 'large',
						prefix: <UserOutlined className={styles.prefixIcon} />,
					}}
					placeholder={intl.formatMessage({
						id: 'pages.login.username.placeholder',
						defaultMessage: 'Nombre de usuario requerido',
					})}
					rules={[
						{
							required: true,
							message: (
								<FormattedMessage
									id="pages.login.username.required"
									defaultMessage="¡Nombre de usuario requerido!"
								/>
							),
						},
					]}
				/>
				<ProFormText.Password
					name="password"
					fieldProps={{
						size: 'large',
						prefix: <LockTwoTone className={styles.prefixIcon} />,
					}}
					placeholder={intl.formatMessage({
						id: 'pages.login.password.placeholder',
						defaultMessage: 'La contraseña es requerida',
					})}
					rules={[
						{
							required: true,
							message: (
								<FormattedMessage
									id="pages.login.password.required"
									defaultMessage="¡Contraseña requerida!"
								/>
							),
						},
					]}
				/>

				{status === 'error' && type === 'mobile' && !submitting && (
					<LoginMessage content="Error" />
				)}
				<div
					style={{
						marginBottom: 24,
					}}
				>
					<ProFormCheckbox noStyle name="autoLogin">
						<FormattedMessage
							id="pages.login.rememberMe"
							defaultMessage="Remember me"
						/>
					</ProFormCheckbox>
					<Link to="/home" style={{ float: 'right' }}>
						<FormattedMessage
							id="pages.login.loginAsGuest"
							defaultMessage="Login As Guest"
						/>
					</Link>
				</div>
			</ProForm>
		</div>
	);
};

export default connect(({ login, loading }) => ({
	userLogin: login,
	submitting: loading.effects['login/login'],
}))(Login);
