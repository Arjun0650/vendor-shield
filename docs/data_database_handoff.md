# VendorTrust — Data & Database Handoff

## 1. Overview

VendorTrust uses Aczen Nova as an external data source and SQLite
as the local database for the hackathon application.

Data flow:

Nova API
    ↓
nova_ingestion.py
    ↓
SQLite + SQLAlchemy
    ↓
DataAccessService
    ↓
Risk Engine / Graph Engine / Investigation Agent

The Nova ingestion process supports pagination and upsert behavior.

---

## 2. Nova Data Currently Ingested

| Resource | Records |
|---|---:|
| Invoices | 300 |
| Vendor Bank Accounts | 32 |
| Vendor Payments | 214 |
| Master Data Changes | 121 |
| Approvals | 1035 |
| **Total** | **1702** |

---

## 3. Synthetic Demo Data

The project also contains a controlled synthetic dataset.

| Table | Records |
|---|---:|
| Vendors | 1500 |
| Employees | 25 |
| Transactions | 20000 |
| Vendor Changes | 500 |

Synthetic data is retained as a fallback/demo dataset.

---

## 4. Nova Database Tables

### nova_invoices

Stores invoice information returned by Nova.

Important fields:

- `id`
- `invoice_number`
- `client_id`
- `client_name`
- `client_gst_number`
- `amount`
- `gst_amount`
- `total_amount`
- `paid_amount`
- `balance_due`
- `status`
- `invoice_date`
- `due_date`
- `currency`
- `business_unit_id`
- `sales_rep_id`

---

### nova_vendor_bank_accounts

Stores vendor bank-account information.

Important fields:

- `id`
- `vendor_id`
- `ifsc`
- `account_last4`
- `account_fingerprint`
- `holder_name`
- `valid_from`
- `valid_to`
- `verified`

Useful for:

- shared bank-account detection
- bank-account verification
- vendor-bank relationships
- bank-account history

---

### nova_vendor_payments

Stores vendor payment information.

Important fields:

- `id`
- `payment_number`
- `vendor_id`
- `beneficiary_account_id`
- `from_account_id`
- `amount`
- `channel`
- `initiated_by`
- `approved_by`
- `initiated_at`
- `status`
- `bank_transaction_id`
- `bill_ids`

Useful for:

- payment risk analysis
- unusual payment detection
- payment history
- beneficiary analysis
- approval analysis

---

### nova_master_data_changes

Stores changes made to master data.

Important fields:

- `id`
- `entity_type`
- `entity_id`
- `field`
- `old_value`
- `new_value`
- `changed_by`
- `changed_at`
- `approved_by`

Useful for:

- bank-detail change detection
- suspicious master-data modifications
- before/after evidence
- change history

---

### nova_approvals

Stores approval actions.

Important fields:

- `id`
- `doc_type`
- `doc_id`
- `level`
- `action`
- `actor_id`
- `acted_at`
- `threshold_applied`

Useful for:

- approval history
- payment approval verification
- audit evidence
- investigation timelines

---

## 5. DataAccessService

File:

`backend/services/data_access.py`

The DataAccessService provides a centralized way for other modules
to access the database.

### Get vendor bank accounts

```python
service.get_vendor_bank_accounts(vendor_id)