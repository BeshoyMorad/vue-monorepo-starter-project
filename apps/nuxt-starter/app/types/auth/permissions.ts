export type DefaultPermissions = 'list' | 'detailed_view' | 'create' | 'update' | 'delete';

/** Resource name → allowed actions. Add a key per resource the backend protects. */
export interface AppPermissions {
  admins: DefaultPermissions;
  assets: 'listView' | 'create' | 'update';
  securityTokens: 'listView' | 'create';
}

export type PermissionModel = keyof AppPermissions;

/** A single `resource.action` string, e.g. `admins.create`. */
export type PermissionKey<Model extends PermissionModel = PermissionModel> =
  Model extends PermissionModel ? `${Model}.${AppPermissions[Model]}` : never;

/** One permission, or a list checked with `or` / `and`. */
export type CanPermission<Model extends PermissionModel = PermissionModel> =
  | PermissionKey<Model>
  | PermissionKey<Model>[];
