import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    bom_json: {
                        table: 'sys_module'
                        id: '988b7d7ad32d49c292d77e89db691958'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: '9e71749cb37244938a52dcff1616ad95'
                    }
                    'split-api': {
                        table: 'sys_ws_definition'
                        id: '7e4a13f6d4a14041ad53e334cdf0c499'
                    }
                    'split-api-delete-expense': {
                        table: 'sys_ws_operation'
                        id: 'e3259f72cc6749d4ab9a9ad59dd24061'
                    }
                    'split-api-delete-group': {
                        table: 'sys_ws_operation'
                        id: '2f1c3323acbd44989d5a9f92b7b690fd'
                    }
                    'split-api-delete-member': {
                        table: 'sys_ws_operation'
                        id: 'd8bd18602e4e4995954044d19a5b82fb'
                    }
                    'split-api-get-balances': {
                        table: 'sys_ws_operation'
                        id: '97d48356e9564fbdb6670ed588b4d1b0'
                    }
                    'split-api-get-dashboard': {
                        table: 'sys_ws_operation'
                        id: 'dd37c115dd2b41ebbc96a3b4060d573d'
                    }
                    'split-api-get-expense': {
                        table: 'sys_ws_operation'
                        id: 'edd90735e0a74583a3798a20e8f0ef50'
                    }
                    'split-api-get-expenses': {
                        table: 'sys_ws_operation'
                        id: 'ea450aacbcc445818689f717e6100b7f'
                    }
                    'split-api-get-group': {
                        table: 'sys_ws_operation'
                        id: '8cb2e0c3daa8477ba6215e5c266de33f'
                    }
                    'split-api-get-groups': {
                        table: 'sys_ws_operation'
                        id: 'a3327edf1c534e24977ecd4557005a72'
                    }
                    'split-api-post-expenses': {
                        table: 'sys_ws_operation'
                        id: '1a23bb4688414a93a7e414ca612c2bd6'
                    }
                    'split-api-post-groups': {
                        table: 'sys_ws_operation'
                        id: '80b4d72b7ab94dfa90a81e191df2b709'
                    }
                    'split-api-post-members': {
                        table: 'sys_ws_operation'
                        id: '0ac19735dc794085a08a2f05ab194be2'
                    }
                    'split-api-post-settlements': {
                        table: 'sys_ws_operation'
                        id: 'da87092c91dc4c13ab4047e5dce0c374'
                    }
                    'split-api-put-expense': {
                        table: 'sys_ws_operation'
                        id: 'de201340e36c4642836cfc006e49ecf3'
                    }
                    'split-si-balance-calculator': {
                        table: 'sys_script_include'
                        id: 'bd9b064333054958bda7d21f3f48e8ee'
                    }
                    'split-si-expense-manager': {
                        table: 'sys_script_include'
                        id: 'aba17aa789344874927ab755fd72634c'
                    }
                    'split-si-settlement-processor': {
                        table: 'sys_script_include'
                        id: '79dc34135f4742fb96c84377b1a4dc71'
                    }
                    'split-si-setup-app': {
                        table: 'sys_script_include'
                        id: '25c34f4be53d4181a5e887f361a46e72'
                    }
                    'split-si-split-utils': {
                        table: 'sys_script_include'
                        id: '43e67410ec074445a6de31a62a179c88'
                    }
                    'src_server_script-includes_BalanceCalculator_server_js': {
                        table: 'sys_module'
                        id: '5d26446ac48c4d65b14825ee6354932a'
                    }
                    'src_server_script-includes_ExpenseManager_server_js': {
                        table: 'sys_module'
                        id: '12af3fcac426445a83fc7ad1313cc923'
                    }
                    'src_server_script-includes_SettlementProcessor_server_js': {
                        table: 'sys_module'
                        id: '4fdaef00097945e7a1bcbd26e7574ea0'
                    }
                    'src_server_script-includes_SetupApp_server_js': {
                        table: 'sys_module'
                        id: '82037aaf001e4ca39d21c6327acc600b'
                    }
                    'src_server_script-includes_SplitUtils_server_js': {
                        table: 'sys_module'
                        id: 'ebfaad7fbbfa41949de54b85e18cc331'
                    }
                }
                composite: [
                    {
                        table: 'sys_dictionary'
                        id: '007d30488a964eea9b595af4fc62b01b'
                        key: {
                            name: 'x_snc_split_share'
                            element: 'settled_amount'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '00e63367ae2b47378ae6d1426258c006'
                        key: {
                            name: 'x_snc_split_expense'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '096341cbbda14f8099a63cd2d7c9d88e'
                        key: {
                            name: 'x_snc_split_expense'
                            element: 'category'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '09db9f887c4e470aa6bdf00c69bd5d89'
                        key: {
                            name: 'x_snc_split_expense'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0b375a17dc58425c8a21a60a07dc1f51'
                        key: {
                            name: 'x_snc_split_membership'
                            element: 'role'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '0c54b730dfd24f49baeee8daf208a3f8'
                        key: {
                            name: 'x_snc_split_settlement'
                            element: 'group'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '0dc4bdfe67294c328fbbb037c34d0d21'
                        key: {
                            name: 'x_snc_split_settlement'
                            element: 'notes'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '0eff4c48882d4971a1ede520449b8112'
                        key: {
                            name: 'x_snc_split_settlement'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '0fb7b5285962409b98ff705d978ed09e'
                        key: {
                            name: 'x_snc_split_expense'
                            element: 'notes'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '11532e4a29e140de948589e4467290aa'
                        key: {
                            name: 'x_snc_split_share'
                            element: 'user'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '121615fccdcf4a799e6efe5afcb4ba2a'
                        key: {
                            name: 'x_snc_split_settlement'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '166f06de1a30423394a30c1064724cf0'
                        key: {
                            name: 'x_snc_split_membership'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '18f5ba1f81c749a2ab5fafe2ad7f4a10'
                        key: {
                            name: 'x_snc_split_expense'
                            element: 'category'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '1ccc744f27a543e5b8c55b83a150b2ca'
                        key: {
                            name: 'x_snc_split_expense'
                            element: 'receipt_image'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2815d095f8124d44a79644dfe88537e5'
                        key: {
                            name: 'x_snc_split_share'
                            element: 'settled'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2ac3c09ff2434783b7a86c5a05a57341'
                        key: {
                            name: 'x_snc_split_settlement'
                            element: 'payment_method'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2b3b9f8d5fab4446bee5e3de7e1f532b'
                        key: {
                            name: 'x_snc_split_membership'
                            element: 'group'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '2e34d81529424378b7f1e46d131e8ad0'
                        key: {
                            name: 'x_snc_split_group'
                            element: 'base_currency'
                            value: 'GBP'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '314699e758ae437c974b7b01c993a8ec'
                        key: {
                            name: 'x_snc_split_share'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact'
                        id: '31f0b144feda4ca590997e493d081ff9'
                        key: {
                            name: 'x_snc_split_split_app.do - BYOUI Files'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '378e0f7f38a94acca3407a6ec6af053c'
                        key: {
                            name: 'x_snc_split_expense'
                            element: 'category'
                            value: 'food_drink'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '38a8d9eea906458fbef65f9feb84cb5c'
                        key: {
                            name: 'x_snc_split_share'
                            element: 'user'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3e19109f3f71455c8483c70d323ea95f'
                        key: {
                            name: 'x_snc_split_share'
                            element: 'settled'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '3f8de3870afc463fa6d6f85b35594f67'
                        key: {
                            name: 'x_snc_split/split_app_main'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '408be23b227943f8ae184f076c31e052'
                        key: {
                            name: 'x_snc_split_expense'
                            element: 'split_type'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4243fee1d54d4ece9173ccd9bcd53144'
                        key: {
                            name: 'x_snc_split_expense'
                            element: 'date'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '47dff20c0a3149e2a3c19b723b390a06'
                        key: {
                            name: 'x_snc_split_share'
                            element: 'amount'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '4cfca556fbeb42c89b665f0e89053c40'
                        key: {
                            name: 'x_snc_split_expense'
                            element: 'split_type'
                            value: 'equal'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '4df253846561457a97109cff2519a7da'
                        key: {
                            name: 'x_snc_split_group'
                            element: 'base_currency'
                            value: 'INR'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '559d4ff1dc654cad88daf92053ad8a73'
                        key: {
                            name: 'x_snc_split_membership'
                            element: 'role'
                            value: 'admin'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '55a5fb7cada64d60bcc8e4256ab715f1'
                        key: {
                            name: 'x_snc_split_group'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '56beeff387bc444c8b785bac5abe46c5'
                        key: {
                            application_file: 'f56677c2fb084bc4b98c163bee28b9e1'
                            source_artifact: '31f0b144feda4ca590997e493d081ff9'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '575df68c8ded4141ba36729e21350ee2'
                        key: {
                            name: 'x_snc_split_membership'
                            element: 'role'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5930b15ba81b4c52b06d2052b59e9be3'
                        key: {
                            name: 'x_snc_split_expense'
                            element: 'notes'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '5a42a46b35dc47c7ab09ed4d44c9d5e7'
                        key: {
                            name: 'x_snc_split_group'
                            element: 'base_currency'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5c4648a5b8e34751b30856292fe4dd03'
                        key: {
                            name: 'x_snc_split_group'
                            element: 'created_by'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '5ec5195d478143bfaaa85c87ddf2a4e6'
                        key: {
                            name: 'x_snc_split_share'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '631fa66fa23242b0b8ccb4f1dc042a93'
                        key: {
                            name: 'x_snc_split_group'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '63851d88d87f499aa8d6283aeb79e3a2'
                        key: {
                            name: 'x_snc_split_group'
                            element: 'created_by'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '63dbc0cdc58743e496127efe69a2aad6'
                        key: {
                            application_file: 'a882d82a91d146a49c91753ff90562de'
                            source_artifact: '31f0b144feda4ca590997e493d081ff9'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '67d494b0990248ed9e96c63a71ce049c'
                        key: {
                            name: 'x_snc_split_settlement'
                            element: 'payment_method'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '699b024629ad41dba6b0bbe7b8bde528'
                        key: {
                            name: 'x_snc_split_membership'
                            element: 'group'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6a9d4a45ca1c41bf835f33ce729c99b2'
                        key: {
                            name: 'x_snc_split_expense'
                            element: 'payer'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6dd74cc3ad964ab6859ad26293f91b9b'
                        key: {
                            name: 'x_snc_split_share'
                            element: 'percentage'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '6f7786713c654f219faa6c2a4532e3da'
                        key: {
                            application_file: '3f8de3870afc463fa6d6f85b35594f67'
                            source_artifact: '31f0b144feda4ca590997e493d081ff9'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6ff1cbc7cca64b84adbf5ec4e09ea4e7'
                        key: {
                            name: 'x_snc_split_share'
                            element: 'settled_amount'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '70998be8aca4404f91e99917169e0e55'
                        key: {
                            name: 'x_snc_split_group'
                            element: 'description'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '73638f786e704ffaae4ac3caeb215fd5'
                        key: {
                            name: 'x_snc_split_expense'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7659293af48d413fb733afcc8178a82a'
                        key: {
                            name: 'x_snc_split_expense'
                            element: 'group'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '795e842ea7e44069b3fa4ac2628163ac'
                        key: {
                            name: 'x_snc_split_settlement'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '79730c9e15884cbd84335b5a28964f49'
                        key: {
                            name: 'x_snc_split_settlement'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '7b503cb84d434c839b2b3b16453e59a0'
                        key: {
                            name: 'x_snc_split_membership'
                            element: 'role'
                            value: 'member'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '802315c464b74a868d744f632ee112b4'
                        key: {
                            name: 'x_snc_split_expense'
                            element: 'amount'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '82e4689a53bb469399335a572d9db45f'
                        key: {
                            name: 'x_snc_split_expense'
                            element: 'group'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '861657f794974cac807e578d3c7ebe54'
                        key: {
                            name: 'x_snc_split_expense'
                            element: 'description'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '8758636d565b4cd99ad038cd05d490e2'
                        key: {
                            name: 'x_snc_split_group'
                            element: 'base_currency'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '8ba5ac86ec934df88b958c08088244ab'
                        key: {
                            name: 'x_snc_split_expense'
                            element: 'category'
                            value: 'entertainment'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '914468413e9d4e859ee74905af894cec'
                        key: {
                            name: 'x_snc_split_settlement'
                            element: 'amount'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '91b6e999593349019a883bc96572afa8'
                        key: {
                            name: 'x_snc_split_expense'
                            element: 'category'
                            value: 'utilities'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '95577e8e7055418499a5dbf0535fdfda'
                        key: {
                            name: 'x_snc_split_settlement'
                            element: 'date'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '95aff95d1bf0471e8780d9401256c0a1'
                        key: {
                            name: 'x_snc_split_settlement'
                            element: 'date'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9a5d54d9eb624456a87f48498d3efa6f'
                        key: {
                            name: 'x_snc_split_share'
                            element: 'shares'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '9d4dea00330d407db45c8f6be4dbbb51'
                        key: {
                            name: 'x_snc_split_group'
                            element: 'base_currency'
                            value: 'USD'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '9ef3ab17ba804be694f984107ea5ab67'
                        key: {
                            name: 'x_snc_split_group'
                            element: 'base_currency'
                            value: 'EUR'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a1f3729e808646b5beeef0d2ff2993c7'
                        key: {
                            name: 'x_snc_split_settlement'
                            element: 'amount'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a6654712589943599e75c4c3bf69fbbd'
                        key: {
                            name: 'x_snc_split_group'
                            element: 'base_currency'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'a82a87d035dd4602a2f8ca5f56e045f2'
                        key: {
                            name: 'x_snc_split_expense'
                            element: 'split_type'
                            value: 'shares'
                        }
                    },
                    {
                        table: 'sys_ui_page'
                        id: 'a882d82a91d146a49c91753ff90562de'
                        key: {
                            endpoint: 'x_snc_split_split_app.do'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a9a0f08c388b4b39b7419b66b5f525c8'
                        key: {
                            name: 'x_snc_split_expense'
                            element: 'payer'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'ac69228805a64fedb655b84996e8b2db'
                        key: {
                            name: 'x_snc_split_group'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'aec40dc99e8647388a142ee68bcdf353'
                        key: {
                            name: 'x_snc_split_group'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b0e171974c57414390e7947d03416467'
                        key: {
                            name: 'x_snc_split_share'
                            element: 'expense'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b7dc3ca3e3fa43c0a160bd42681e3cbc'
                        key: {
                            name: 'x_snc_split_expense'
                            element: 'category'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'b87570bb15a64bf8826dc76d8e97bcd1'
                        key: {
                            name: 'x_snc_split_expense'
                            element: 'split_type'
                            value: 'percentage'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b9fda7fd489940fc86f5823ea8331c57'
                        key: {
                            name: 'x_snc_split_membership'
                            element: 'user'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'bbd7bb9be3dd4a17a108dfca28d994ba'
                        key: {
                            name: 'x_snc_split_share'
                            element: 'shares'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'bd5b201c2fb545689acb0036b8eaa959'
                        key: {
                            name: 'x_snc_split_expense'
                            element: 'amount'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'bfeb39830eb840aca586b75ffe6cdf16'
                        key: {
                            name: 'x_snc_split_settlement'
                            element: 'group'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c1bf0774a405451abeb0964908446457'
                        key: {
                            name: 'x_snc_split_membership'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c31562980bdd48fba12d79e7ee828351'
                        key: {
                            name: 'x_snc_split_membership'
                            element: 'user'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c557d31bc84a475b97293cc8d270feda'
                        key: {
                            name: 'x_snc_split_expense'
                            element: 'description'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c72fbac3bf4f46eeb6578a9eec8c1cdc'
                        key: {
                            name: 'x_snc_split_group'
                            element: 'description'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c9219107091b4a3dbe6eaa6b6ea7e6b6'
                        key: {
                            name: 'x_snc_split_group'
                            element: 'name'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c96f7d68b7ca421fb20d7a45cdb1429f'
                        key: {
                            name: 'x_snc_split_group'
                            element: 'name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'caf8c197db9e4253911eb84e2949d0ed'
                        key: {
                            name: 'x_snc_split_membership'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'cc063097669f40a29768338619bd62dd'
                        key: {
                            name: 'x_snc_split_settlement'
                            element: 'from_user'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'cfedc63e12024e489879b9ba8ada951e'
                        key: {
                            name: 'x_snc_split_share'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd46218b812294735841fd88acb351e71'
                        key: {
                            name: 'x_snc_split_membership'
                            element: 'role'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd51b0943a31242a39d681620726686a3'
                        key: {
                            name: 'x_snc_split_share'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'dbff49e5892b4c18829ec0479c8cbfcd'
                        key: {
                            name: 'x_snc_split_expense'
                            element: 'split_type'
                            value: 'exact'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e20b8b03a68c404d942f74e14ec30274'
                        key: {
                            name: 'x_snc_split_expense'
                            element: 'split_type'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e3807af81d134cea8cc7e3a1a93ec0a3'
                        key: {
                            name: 'x_snc_split_settlement'
                            element: 'to_user'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e59df06343c5457daa1fa7444b5da1b0'
                        key: {
                            name: 'x_snc_split_expense'
                            element: 'receipt_image'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e8110fd3b5c94e2a996e6c80da788044'
                        key: {
                            name: 'x_snc_split_settlement'
                            element: 'from_user'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'ea10300edcd34c7a81a24bb85df4f8d2'
                        key: {
                            name: 'x_snc_split_expense'
                            element: 'category'
                            value: 'travel'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'eab1955e84f640e29bdcbfedeaa28425'
                        key: {
                            name: 'x_snc_split_expense'
                            element: 'date'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'eaf10d4d10934e17ad035db236b9388d'
                        key: {
                            name: 'x_snc_split_share'
                            element: 'expense'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'eda633bfc04149018f74b10062c1c33c'
                        key: {
                            name: 'x_snc_split_settlement'
                            element: 'notes'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f358aa6eb1b74517be1d92006842985e'
                        key: {
                            name: 'x_snc_split_share'
                            element: 'amount'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: 'f56677c2fb084bc4b98c163bee28b9e1'
                        key: {
                            name: 'x_snc_split/split_app_main.js.map'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'f827b970fdf14b58bbb656b70235e1ee'
                        key: {
                            name: 'x_snc_split_membership'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'fa9e630783a342c9aec4918b9588d51e'
                        key: {
                            name: 'x_snc_split_expense'
                            element: 'split_type'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'fc25ead384b74901bcc679898ab6ce91'
                        key: {
                            name: 'x_snc_split_expense'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'fc8630619a6c4f769cd37298e777b9f8'
                        key: {
                            name: 'x_snc_split_expense'
                            element: 'category'
                            value: 'other'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'fe78975872b24a6ba170c1070bb4d702'
                        key: {
                            name: 'x_snc_split_settlement'
                            element: 'to_user'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ffd26b93d7db4b0ea1ea6264318c3882'
                        key: {
                            name: 'x_snc_split_share'
                            element: 'percentage'
                        }
                    },
                ]
            }
        }
    }
}
