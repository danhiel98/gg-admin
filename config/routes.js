export default [
	{
		path: '/',
		component: '../layouts/BlankLayout',
		routes: [
			{
				path: '/user',
				component: '../layouts/UserLayout',
				routes: [
					{
						name: 'login',
						path: '/user/login',
						component: './User/login',
					},
				],
			},
			{
				path: '/',
				component: '../layouts/SecurityLayout',
				routes: [
					{
						path: '/',
						component: '../layouts/BasicLayout',
						authority: ['admin', 'user'],
						routes: [
							{
								path: '/',
								redirect: '/home',
							},
							{
								path: '/home',
								name: 'home',
								icon: 'home',
								component: './Home',
							},
							// {
							// 	path: '/admin',
							// 	name: 'admin',
							// 	icon: 'crown',
							// 	component: './Admin',
							// 	authority: ['admin'],
							// 	routes: [
							// 		{
							// 			path: '/admin/sub-page',
							// 			name: 'sub-page',
							// 			icon: 'smile',
							// 			component: './Home',
							// 			authority: ['admin'],
							// 		},
							// 	],
							// },
							{
								name: 'orders',
								icon: 'snippets',
								path: '/orders',
								component: './Order',
							},
							{
								name: 'customers',
								icon: 'smile',
								path: '/customers',
								component: './Customer',
							},
							{
								component: './404',
							},
						],
					},
					{
						component: './404',
					},
				],
			},
		],
	},
	{
		component: './404',
	},
];
