import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
const pageid: any= 0;
const routes: Routes = [
    {
        path: 'tabs',
        component: TabsPage,
        children:
            [
                {
                    path: 'home',
                    children:
                        [
                            {
                                path: '',
                                loadChildren: '../home/home.module#HomePageModule'
                            }
                        ]
                },
                {
                    path: 'products',
                    children:
                        [
                            {
                                path: '',
                                children: [
                                    {
                                        path: '',
                                        loadChildren: '../products/products.module#ProductsPageModule'
                                    },
                                    {
                                        path: 'product-detail',
                                        children: [
                                            {
                                                path: '',
                                                loadChildren: '../product-detail/product-detail.module#ProductDetailPageModule'
                                            },
                                            {
                                                path: 'product-otherstores',
                                                loadChildren: '../product-otherstores/product-otherstores.module#ProductOtherstoresPageModule'
                                            },
                                            {
                                                path: 'product-warehouse',
                                                loadChildren: '../product-warehouse/product-warehouse.module#ProductWarehousePageModule'
                                            }
                                        ]
                                    },
                                    {
                                        path: 'product-groups',
                                        children: [
                                            {
                                                path: '',
                                                loadChildren: '../product-groups/product-groups.module#ProductGroupsPageModule'
                                            },
                                            {
                                                path: 'product-attributes',
                                                children: [
                                                    {
                                                        path: '',
                                                        loadChildren: '../product-attributes/product-attributes.module#ProductAttributesPageModule'
                                                    },
                                                    {
                                                        path: 'product-list',
                                                        children: [
                                                            {
                                                                path: '',
                                                                loadChildren: '../product-list/product-list.module#ProductListPageModule'
                                                            },
                                                            {
                                                                path: 'product-detail',
                                                                children: [
                                                                    {
                                                                        path: '',
                                                                        loadChildren: '../product-detail/product-detail.module#ProductDetailPageModule'
                                                                    },
                                                                    {
                                                                        path: 'product-otherstores',
                                                                        loadChildren: '../product-otherstores/product-otherstores.module#ProductOtherstoresPageModule'
                                                                    },
                                                                    {
                                                                        path: 'product-warehouse',
                                                                        loadChildren: '../product-warehouse/product-warehouse.module#ProductWarehousePageModule'
                                                                    }
                                                                ]
                                                            },
                                                        ]

                                                    }
                                                ]

                                            },
                                        ]
                                    },
                                    {
                                        path: 'product-filter',
                                        children: [
                                            {
                                                path: '',
                                                loadChildren: '../product-filter/product-filter.module#ProductFilterPageModule'
                                            },
                                            {
                                                path: 'product-list',
                                                children: [
                                                    {
                                                        path: '',
                                                        loadChildren: '../product-list/product-list.module#ProductListPageModule'
                                                    },
                                                    {
                                                        path: 'product-detail',
                                                        children: [
                                                            {
                                                                path: '',
                                                                loadChildren: '../product-detail/product-detail.module#ProductDetailPageModule'
                                                            },
                                                            {
                                                                path: 'product-warehouse',
                                                                loadChildren: '../product-warehouse/product-warehouse.module#ProductWarehousePageModule'
                                                            },
                                                            {
                                                                path: 'product-otherstores',
                                                                loadChildren: '../product-otherstores/product-otherstores.module#ProductOtherstoresPageModule'
                                                            },
                                                        ]

                                                    },

                                                ]

                                            }
                                        ]

                                    },

                                ]

                            },

                        ]
                },
                {
                    path: 'customers',                    
                    children:
                        [
                            {
                                path: '',
                                loadChildren: '../customers/customers.module#CustomersPageModule'
                            },
                            {
                                path: 'customer-detail',
                                loadChildren: '../customer-detail/customer-detail.module#CustomerDetailPageModule'
                            },
                            {
                                path: 'customer-list',
                                children: [
                                    {
                                        path: '',
                                        loadChildren: '../customer-list/customer-list.module#CustomerListPageModule'
                                    },
                                    {
                                        path: 'customer-detail',
                                        children: [
                                            {
                                                path: '',
                                                loadChildren: '../customer-detail/customer-detail.module#CustomerDetailPageModule'
                                            },
                                            {
                                                path: 'customer-extra-report',
                                                children: [
                                                    {
                                                        path: '',
                                                        loadChildren: '../customer-extra-report/customer-extra-report.module#CustomerExtraReportPageModule'
                                                    },
                                                    {
                                                        path: 'customer-extra-report-detail',
                                                        loadChildren: '../customer-extra-report-detail/customer-extra-report-detail.module#CustomerExtraReportDetailPageModule'
                                                    },
                                                    {
                                                        path: 'customer-installment-detail',
                                                        loadChildren: '../customer-installment-detail/customer-installment-detail.module#CustomerInstallmentDetailPageModule'
                                                    }
                                                ]

                                            },

                                        ]
                                    }
                                ]
                            },
                        ]
                },
                {
                    path: 'proposal',
                    children:
                        [
                            {
                                path: '',
                                loadChildren: '../proposal/proposal.module#ProposalPageModule'
                            },
                            {
                                path: 'proposal-type',
                                loadChildren: '../proposal-type/proposal-type.module#ProposalTypePageModule'//buradan proposal type sayfasına gidecek ...
                            },
                            {
                                path: 'customers',
                                
                                children: [
                                    {
                                        path: '',
                                        loadChildren: '../customers/customers.module#CustomersPageModule'
                                    },
                                    {
                                        path: 'customer-list',
                                        loadChildren: '../customer-list/customer-list.module#CustomerListPageModule'
                                    },
                                ]
                            },
                            {
                                path: 'customer-detail',
                                loadChildren: '../customer-detail/customer-detail.module#CustomerDetailPageModule'
                            },
                            {
                                path: 'products',
                                children:
                                    [
                                        {
                                            path: '',
                                            children: [
                                                {
                                                    path: '',
                                                    loadChildren: '../products/products.module#ProductsPageModule'
                                                },
                                                {
                                                    path: 'product-select-product',
                                                    loadChildren: '../product-select-product/product-select-product.module#ProductSelectProductPageModule'
                                                },
                                                {
                                                    path: 'product-groups',
                                                    children: [
                                                        {
                                                            path: '',
                                                            loadChildren: '../product-groups/product-groups.module#ProductGroupsPageModule'
                                                        },
                                                        {
                                                            path: 'product-attributes',
                                                            children: [
                                                                {
                                                                    path: '',
                                                                    loadChildren: '../product-attributes/product-attributes.module#ProductAttributesPageModule'
                                                                },
                                                                {
                                                                    path: 'product-list',
                                                                    children: [
                                                                        {
                                                                            path: '',
                                                                            loadChildren: '../product-list/product-list.module#ProductListPageModule'
                                                                        },
                                                                        {
                                                                            path: 'product-select-product',
                                                                            loadChildren: '../product-select-product/product-select-product.module#ProductSelectProductPageModule'
                                                                        },
                                                                    ]

                                                                }
                                                            ]

                                                        },
                                                    ]
                                                },
                                                {
                                                    path: 'product-filter',
                                                    children: [
                                                        {
                                                            path: '',
                                                            loadChildren: '../product-filter/product-filter.module#ProductFilterPageModule'
                                                        },
                                                        {
                                                            path: 'product-list',
                                                            children: [
                                                                {
                                                                    path: '',
                                                                    loadChildren: '../product-list/product-list.module#ProductListPageModule'
                                                                },
                                                                {
                                                                    path: 'product-select-product',
                                                                    loadChildren: '../product-select-product/product-select-product.module#ProductSelectProductPageModule'
                                                                },

                                                            ]

                                                        }
                                                    ]

                                                },

                                            ]

                                        },

                                    ]
                            },

                        ]
                },
                {
                    path: 'notifications',
                    children:
                        [
                            {
                                path: '',
                                loadChildren: '../notifications/notifications.module#NotificationsPageModule'
                            },
                            {
                                path:'open-orders',
                                children:
                                [
                                    {
                                        path:'',
                                        loadChildren:'../open-orders/open-orders.module#OpenOrdersPageModule'
                                    }
                                    
                                ]
                            },
                            {
                                path:'shipments',
                                children:
                                [
                                    {
                                        path:'',
                                        loadChildren:'../shipments/shipments.module#ShipmentsPageModule'
                                    }
                                    
                                ]
                            }
                    ]
                  },
                {
                    path: 'reports',
                    children: [
                        {
                            path: '',
                            loadChildren: '../reports/reports.module#ReportsPageModule'
                        },
                        {
                            path: 'customers',
                            
                            children:
                                [
                                    {
                                        path: '',
                                        loadChildren: '../customers/customers.module#CustomersPageModule'
                                    },
                                    {
                                        path: 'customer-list',
                                        children: [
                                            {
                                                path: '',
                                                loadChildren: '../customer-list/customer-list.module#CustomerListPageModule'
                                            },
                                            {
                                                path: 'customer-extra-report',
                                                children: [
                                                    {
                                                        path: '',
                                                        loadChildren: '../customer-extra-report/customer-extra-report.module#CustomerExtraReportPageModule'
                                                    },
                                                    {
                                                        path: 'customer-extra-report-detail',
                                                        loadChildren: '../customer-extra-report-detail/customer-extra-report-detail.module#CustomerExtraReportDetailPageModule'
                                                    }
                                                ]
                                            },
                                            { 
                                                path: 'customer-detail', 
                                                children: [
                                                        {
                                                            path: '',
                                                            loadChildren: '../customer-detail/customer-detail.module#CustomerDetailPageModule' 
                                                        }, 
                                                        {
                                                            path: 'customer-extra-report',
                                                            children: [
                                                                {
                                                                    path: '',
                                                                    loadChildren: '../customer-extra-report/customer-extra-report.module#CustomerExtraReportPageModule'
                                                                },
                                                                {
                                                                    path: 'customer-extra-report-detail',
                                                                    loadChildren: '../customer-extra-report-detail/customer-extra-report-detail.module#CustomerExtraReportDetailPageModule'
                                                                },
                                                                {
                                                                    path: 'customer-installment-detail',
                                                                    loadChildren: '../customer-installment-detail/customer-installment-detail.module#CustomerInstallmentDetailPageModule'
                                                                }
                                                            ]
                                                     }
                                                ]
                                                
                                            }
                                        ]
                                    },
                                ]
                        },
                        {
                            path: 'report-proposal',
                            children: [
                                {
                                    path: '',
                                    loadChildren: '../report-proposal/report-proposal.module#ReportProposalPageModule'
                                },
                                {
                                    path: 'report-proposal-detail',
                                    loadChildren: '../report-proposal-detail/report-proposal-detail.module#ReportProposalDetailPageModule'
                                }
                            ]
                        },
                        {
                            path: 'product-filter',
                            children: [
                                {
                                    path: '',
                                    loadChildren: '../product-filter/product-filter.module#ProductFilterPageModule'
                                },
                                {
                                    path: 'product-list',
                                    children: [
                                        {
                                            path: '',
                                            loadChildren: '../product-list/product-list.module#ProductListPageModule'
                                        },
                                        {
                                            path: 'product-warehouse',
                                            loadChildren: '../product-warehouse/product-warehouse.module#ProductWarehousePageModule'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                
                {
                    path: '',
                    redirectTo: '/tabs/home',
                    pathMatch: 'full'
                }
            ]
    },
    {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
    }
];

@NgModule({
    imports:
        [
            RouterModule.forChild(routes)
        ],
    exports:
        [
            RouterModule
        ]
})
export class TabsPageRoutingModule { }