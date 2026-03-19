// import { deleteRole, departmentWiseList, getPermissions, getRole, getRoles, postPermissions, postRole } from '../../../controllers/hrm/roles.controller';
import { deleteRole, getPermissions, getRole, getRoles, postPermissions, postRole } from '../../../controllers/hrm/role.controller';
import { Router } from 'express';
import { employeePermission, isAdminOrEmployee } from '../../../middlewares/auth.middleware';
import { getOrDelRoleValidator, postRoleValidator } from '../../../middlewares/hrm/roles.middleware';
// import { employeePermission, isAdminOrEmployee } from '../../../middlewares/auth.middleware';
// import { getOrDelRoleValidator, postRoleValidator } from '../../../middlewares/hrm/roles.middleware';

const roleRoutes = Router();

roleRoutes.get('/list', isAdminOrEmployee, employeePermission("roles_view_view"), getRoles)
roleRoutes.post('/', isAdminOrEmployee, employeePermission("roles_view_create"), postRoleValidator, postRole)
roleRoutes.get('/', isAdminOrEmployee, employeePermission("roles_view_view"), getOrDelRoleValidator, getRole)
roleRoutes.delete('/', isAdminOrEmployee, employeePermission("roles_view_delete"), getOrDelRoleValidator, deleteRole)

roleRoutes.post('/permissions', isAdminOrEmployee, employeePermission("roles_view_edit"), postPermissions)
roleRoutes.get('/permissions',  getPermissions)

export default roleRoutes;
