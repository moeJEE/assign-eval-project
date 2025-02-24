/**
 * OpenApi Specification - Kachmar
 *
 * Contact: contact@kachmar.ma
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { User } from './user';


export interface Role { 
    id?: number;
    createdAt?: string;
    modifiedAt?: string;
    name?: Role.NameEnum;
    users?: Array<User>;
}
export namespace Role {
    export type NameEnum = 'PROJECT_MANAGER' | 'DEVELOPER';
    export const NameEnum = {
        ProjectManager: 'PROJECT_MANAGER' as NameEnum,
        Developer: 'DEVELOPER' as NameEnum
    };
}


