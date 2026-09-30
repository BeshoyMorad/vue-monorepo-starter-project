export {};
declare global {
  type DefaultPermissions = 'list' | 'detailed_view' | 'create' | 'update' | 'delete';

  interface AppPermissions {
    admin: DefaultPermissions;
  }

  type Models = keyof AppPermissions;

  type CanPermission<Model extends Models = Models> =
    | (Model extends Models ? `${Model}.${AppPermissions[Model]}` : never)
    | (Model extends Models ? `${Model}.${AppPermissions[Model]}` : never)[];
}
