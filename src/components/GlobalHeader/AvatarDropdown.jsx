import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu } from 'antd';
import React from 'react';
import { history, connect } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

class AvatarDropdown extends React.Component {
	onMenuClick = (event) => {
		const { key } = event;

		if (key === 'logout') {
			const { dispatch } = this.props;

			if (dispatch) {
				dispatch({
					type: 'login/logout',
				});
			}

			return;
		}

		history.push(`/account/${key}`);
	};

	render() {
		const {
			currentUser = {
				avatar: '',
				name: '',
			},
			menu,
		} = this.props;
		// console.log(this.props);
		const menuHeaderDropdown = (
			<Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
				<Menu.Item key="center">
					<UserOutlined />
					Perfil
				</Menu.Item>
				<Menu.Item key="settings">
					<SettingOutlined />
					Configuración
				</Menu.Item>
				<Menu.Divider />
				<Menu.Item key="logout">
					<LogoutOutlined />
					Cerrar Sesión
				</Menu.Item>
			</Menu>
		);
		return (
			<HeaderDropdown overlay={menuHeaderDropdown}>
				<span className={`${styles.action} ${styles.account}`}>
					<Avatar
						size="small"
						className={styles.avatar}
						src={'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'}
						alt="avatar"
					/>
					<span className={`${styles.name} anticon`}>
						{
							currentUser.displayName ||
							currentUser.email ||
							'Invitado'
						}
					</span>
				</span>
			</HeaderDropdown>
		)
	}
}

export default connect(({ user }) => ({
	currentUser: user.currentUser,
}))(AvatarDropdown);
