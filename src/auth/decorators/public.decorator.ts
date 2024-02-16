import { SetMetadata } from "@nestjs/common";

/**
 * Constante isPublic
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Constante Public para setear la metadata
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);