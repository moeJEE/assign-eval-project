/**
 * OpenApi Specification - Kachmar
 *
 * Contact: contact@kachmar.ma
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface ProjectRequest { 
    code: string;
    title: string;
    description?: string;
    status: string;
    startDate: string;
    endDate: string;
    skillIds: Array<number>;
    developerIds: Array<number>;
    projectManagerId: number;
}

