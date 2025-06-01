
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.StatusScalarFieldEnum = {
  id: 'id',
  name: 'name',
  created_at: 'created_at',
  update_at: 'update_at'
};

exports.Prisma.Status_orderScalarFieldEnum = {
  id: 'id',
  name: 'name',
  created_at: 'created_at',
  update_at: 'update_at'
};

exports.Prisma.BrandScalarFieldEnum = {
  id: 'id',
  name: 'name',
  brand: 'brand',
  created_at: 'created_at',
  update_at: 'update_at'
};

exports.Prisma.SubdistrictScalarFieldEnum = {
  id: 'id',
  name: 'name',
  id_city: 'id_city',
  created_at: 'created_at',
  update_at: 'update_at'
};

exports.Prisma.CityScalarFieldEnum = {
  id: 'id',
  name: 'name',
  id_prov: 'id_prov',
  created_at: 'created_at',
  update_at: 'update_at'
};

exports.Prisma.ProvinceScalarFieldEnum = {
  id: 'id',
  name: 'name',
  created_at: 'created_at',
  update_at: 'update_at'
};

exports.Prisma.CategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  created_at: 'created_at',
  update_at: 'update_at'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  username: 'username',
  password: 'password',
  name: 'name',
  email: 'email',
  phone: 'phone',
  poin: 'poin',
  id_status: 'id_status',
  created_at: 'created_at',
  update_at: 'update_at'
};

exports.Prisma.CourierScalarFieldEnum = {
  id: 'id',
  username: 'username',
  password: 'password',
  name: 'name',
  email: 'email',
  phone: 'phone',
  number_plate: 'number_plate',
  id_brand: 'id_brand',
  color: 'color',
  is_active: 'is_active',
  id_status: 'id_status',
  created_at: 'created_at',
  update_at: 'update_at'
};

exports.Prisma.MerchantScalarFieldEnum = {
  id: 'id',
  username: 'username',
  password: 'password',
  name: 'name',
  address: 'address',
  id_subd: 'id_subd',
  id_city: 'id_city',
  id_prov: 'id_prov',
  email: 'email',
  phone: 'phone',
  is_open: 'is_open',
  id_status: 'id_status',
  created_at: 'created_at',
  update_at: 'update_at'
};

exports.Prisma.MenuScalarFieldEnum = {
  id: 'id',
  name: 'name',
  detail: 'detail',
  id_merchant: 'id_merchant',
  id_category: 'id_category',
  price: 'price',
  is_ready: 'is_ready',
  created_at: 'created_at',
  update_at: 'update_at'
};

exports.Prisma.VariantScalarFieldEnum = {
  id: 'id',
  name: 'name',
  id_menu: 'id_menu',
  created_at: 'created_at',
  update_at: 'update_at'
};

exports.Prisma.Variant_itemScalarFieldEnum = {
  id: 'id',
  name: 'name',
  id_variant: 'id_variant',
  price: 'price',
  created_at: 'created_at',
  update_at: 'update_at'
};

exports.Prisma.OrderScalarFieldEnum = {
  id: 'id',
  id_user: 'id_user',
  name_user: 'name_user',
  id_merchant: 'id_merchant',
  name_merchant: 'name_merchant',
  id_courier: 'id_courier',
  name_courier: 'name_courier',
  destination: 'destination',
  id_subd: 'id_subd',
  name_subd: 'name_subd',
  id_city: 'id_city',
  name_city: 'name_city',
  id_prov: 'id_prov',
  name_prov: 'name_prov',
  shipping_cost: 'shipping_cost',
  created_at: 'created_at',
  update_at: 'update_at'
};

exports.Prisma.Order_itemScalarFieldEnum = {
  id: 'id',
  id_menu: 'id_menu',
  name_menu: 'name_menu',
  id_variant: 'id_variant',
  name_variant: 'name_variant',
  qty: 'qty',
  note: 'note',
  price: 'price',
  id_order: 'id_order',
  created_at: 'created_at',
  update_at: 'update_at'
};

exports.Prisma.Log_orderScalarFieldEnum = {
  id: 'id',
  id_order: 'id_order',
  id_status: 'id_status',
  detail_status: 'detail_status',
  change_by: 'change_by',
  id_changer: 'id_changer',
  time: 'time'
};

exports.Prisma.History_orderScalarFieldEnum = {
  id: 'id',
  id_user: 'id_user',
  name_user: 'name_user',
  id_merchant: 'id_merchant',
  name_merchant: 'name_merchant',
  id_courier: 'id_courier',
  name_courier: 'name_courier',
  destination: 'destination',
  id_subd: 'id_subd',
  name_subd: 'name_subd',
  id_city: 'id_city',
  name_city: 'name_city',
  id_prov: 'id_prov',
  name_prov: 'name_prov',
  shipping_cost: 'shipping_cost',
  created_at: 'created_at',
  update_at: 'update_at'
};

exports.Prisma.History_order_itemScalarFieldEnum = {
  id: 'id',
  id_menu: 'id_menu',
  name_menu: 'name_menu',
  id_variant: 'id_variant',
  name_variant: 'name_variant',
  qty: 'qty',
  note: 'note',
  price: 'price',
  id_order: 'id_order',
  created_at: 'created_at',
  update_at: 'update_at'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.StatusOrderByRelevanceFieldEnum = {
  name: 'name'
};

exports.Prisma.Status_orderOrderByRelevanceFieldEnum = {
  name: 'name'
};

exports.Prisma.BrandOrderByRelevanceFieldEnum = {
  name: 'name',
  brand: 'brand'
};

exports.Prisma.SubdistrictOrderByRelevanceFieldEnum = {
  name: 'name'
};

exports.Prisma.CityOrderByRelevanceFieldEnum = {
  name: 'name'
};

exports.Prisma.ProvinceOrderByRelevanceFieldEnum = {
  name: 'name'
};

exports.Prisma.CategoryOrderByRelevanceFieldEnum = {
  name: 'name'
};

exports.Prisma.UserOrderByRelevanceFieldEnum = {
  id: 'id',
  username: 'username',
  password: 'password',
  name: 'name',
  email: 'email',
  phone: 'phone'
};

exports.Prisma.CourierOrderByRelevanceFieldEnum = {
  id: 'id',
  username: 'username',
  password: 'password',
  name: 'name',
  email: 'email',
  phone: 'phone',
  number_plate: 'number_plate',
  color: 'color'
};

exports.Prisma.MerchantOrderByRelevanceFieldEnum = {
  id: 'id',
  username: 'username',
  password: 'password',
  name: 'name',
  address: 'address',
  email: 'email',
  phone: 'phone'
};

exports.Prisma.MenuOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name',
  detail: 'detail',
  id_merchant: 'id_merchant'
};

exports.Prisma.VariantOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name',
  id_menu: 'id_menu'
};

exports.Prisma.Variant_itemOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name',
  id_variant: 'id_variant'
};

exports.Prisma.OrderOrderByRelevanceFieldEnum = {
  id: 'id',
  id_user: 'id_user',
  name_user: 'name_user',
  id_merchant: 'id_merchant',
  name_merchant: 'name_merchant',
  id_courier: 'id_courier',
  name_courier: 'name_courier',
  destination: 'destination',
  name_subd: 'name_subd',
  name_city: 'name_city',
  name_prov: 'name_prov'
};

exports.Prisma.Order_itemOrderByRelevanceFieldEnum = {
  id: 'id',
  id_menu: 'id_menu',
  name_menu: 'name_menu',
  id_variant: 'id_variant',
  name_variant: 'name_variant',
  note: 'note',
  id_order: 'id_order'
};

exports.Prisma.Log_orderOrderByRelevanceFieldEnum = {
  id_order: 'id_order',
  detail_status: 'detail_status',
  change_by: 'change_by',
  id_changer: 'id_changer'
};

exports.Prisma.History_orderOrderByRelevanceFieldEnum = {
  id: 'id',
  id_user: 'id_user',
  name_user: 'name_user',
  id_merchant: 'id_merchant',
  name_merchant: 'name_merchant',
  id_courier: 'id_courier',
  name_courier: 'name_courier',
  destination: 'destination',
  name_subd: 'name_subd',
  name_city: 'name_city',
  name_prov: 'name_prov'
};

exports.Prisma.History_order_itemOrderByRelevanceFieldEnum = {
  id: 'id',
  id_menu: 'id_menu',
  name_menu: 'name_menu',
  id_variant: 'id_variant',
  name_variant: 'name_variant',
  note: 'note',
  id_order: 'id_order'
};


exports.Prisma.ModelName = {
  Status: 'Status',
  Status_order: 'Status_order',
  Brand: 'Brand',
  Subdistrict: 'Subdistrict',
  City: 'City',
  Province: 'Province',
  Category: 'Category',
  User: 'User',
  Courier: 'Courier',
  Merchant: 'Merchant',
  Menu: 'Menu',
  Variant: 'Variant',
  Variant_item: 'Variant_item',
  Order: 'Order',
  Order_item: 'Order_item',
  Log_order: 'Log_order',
  History_order: 'History_order',
  History_order_item: 'History_order_item'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
