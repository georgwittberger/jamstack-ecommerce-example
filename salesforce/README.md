# JAMStack E-Commerce Example Salesforce Module

This module contains a SFDX project containing the Salesforce metadata required to set up the showcase.

## Metadata Components

| Type                     | API Name                                          | Description                                             |
| ------------------------ | ------------------------------------------------- | ------------------------------------------------------- |
| CustomObject             | jsec_ProductCategory\_\_c                         | Object to store product categories                      |
| Layout                   | jsec_ProductCategory\_\_c-Product Category Layout | Default layout for product categories                   |
| CustomTab                | jsec_ProductCategory\_\_c                         | Custom tab to view product categories                   |
| PermissionSet            | jsec_ProductCategoryEditor                        | Permissions to edit product categories                  |
| CustomField              | Product2.jsec_ProductCategory\_\_c                | Lookup field for the category related to a product      |
| LightningComponentBundle | jsec_autoLogout                                   | Web component used for the logout page in the community |

## Deploying to Salesforce

Install [Salesforce CLI](https://developer.salesforce.com/tools/sfdxcli) and connect it to your Salesforce org.

Run the following CLI command in this module directory:

```bash
sfdx force:source:deploy -p force-app
```
