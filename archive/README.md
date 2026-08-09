# Archived pages

These files are **parked, not deleted**. Nothing in the app imports them, so they were already
being stripped out of every build — editing them here or in `src/` could never change the live
site. They were moved out of `src/` on 2026-08-09 so they stop being mistaken for live code.

**To bring one back:** move it to the same path under `src/` (e.g.
`archive/src/pages/Sellers.tsx` → `src/pages/Sellers.tsx`) and add its `<Route>` in `src/App.tsx`.
The folder layout here mirrors `src/` exactly so a restore is a straight move back.

**Before restoring, check the page actually works.** Some of these were never finished. For
example `src/pages/CustomerOrders.tsx` (still in `src/`, also unrouted) renders three hardcoded
example orders rather than reading the database — routing it as-is would show invented orders to
real customers.

## What is in here

**Multi-vendor / seller pages (23)** — from when this app was a multi-seller marketplace. It was
deliberately converted to a single-store admin model, so these are the abandoned half:
`Sellers`, `SellerAnalytics`, `SellerCustomers`, `SellerDashboard`, `SellerDashboardNew`,
`SellerDocumentUpload`, `SellerEarnings`, `SellerMessageReply`, `SellerMessages`,
`SellerNotifications`, `SellerOrders`, `SellerProductNew`, `SellerProducts`, `SellerProfile`,
`SellerSettings`, `SellerSubscription`, `SellerWithdrawalRequest`, `ShopOwnerDocuments`,
`ShopOwnerManagement`, `ShopOwnerPaymentManagement`, `StoreDetail`, `SubscriptionManagement`,
`SubscriptionDebug`.

**Older copies of pages that still exist (7)** — the live version is named alongside each:
| archived | live version in `src/` |
|---|---|
| `AdminDashboard` | `AdminDashboardNew` |
| `SimpleAdminDashboard` | `AdminDashboardNew` |
| `CategoryPage` | `CategoryPageNew` |
| `Login` | `LoginNew` |
| `Products` | `ProductsNew` |
| `IfuddaHome` | `IfuddaHomeNew` |
| `Index` | `IfuddaHomeNew` |

**`CheckoutPage`** — an unrouted copy of the checkout. Its UK address/phone changes were merged
into the live `src/pages/Checkout.tsx` on 2026-08-09, so this copy is superseded.

**Scratch pages (4)** — `AdminDirect`, `PaymentDemo`, `PasswordResetTest`, `QRCodeUploadHelp`.

## Not archived

Finished customer-facing pages that exist in `src/` but have no route yet — registration,
password reset, order tracking, returns, wishlist, addresses, help and others — were deliberately
left in `src/` pending a decision on whether to switch them on.
