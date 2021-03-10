import { getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useIntl, connect, FormattedMessage } from 'umi';
import React from 'react';
import logo from '../assets/gg.svg';
import styles from './UserLayout.less';

const UserLayout = (props) => {
	const {
		route = {
			routes: [],
		},
	} = props;
	const { routes = [] } = route;
	const {
		children,
		location = {
			pathname: '',
		},
	} = props;
	const { formatMessage } = useIntl();
	const { breadcrumb } = getMenuData(routes);
	const title = getPageTitle({
		pathname: location.pathname,
		formatMessage,
		breadcrumb,
		...props,
	});

	return (
		<HelmetProvider>
			<Helmet>
				<title>{title}</title>
				<meta name="description" content={title} />
			</Helmet>

			<div className={styles.container}>
				<div className={styles.content}>
					<div className={styles.top}>
						<div className={styles.header}>
							<img alt="logo" className={styles.logo} src={logo} />
							<span className={styles.title}>Grupo García</span>
							{/* <Link to="/user/login">
							</Link> */}
						</div>
						<div className={styles.desc}>
							<FormattedMessage
								id="pages.layouts.userLayout.title"
								defaultMessage="Title"
							/>
						</div>
					</div>
					{children}
				</div>
				{/* <DefaultFooter /> */}
			</div>
		</HelmetProvider>
	);
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
