export const LOGIN = '/login'

export const PROFILE = '/profile'

export const DOCUMENTS = '/documents'
export const DOCUMENT = `${DOCUMENTS}/:id`
export const DOCUMENT_CONTENT = `${DOCUMENT}/content`

export const DICTIONARY = '/dictionary'

export const SEARCH = '/search'

export const ADMIN_ROOT = '/admin'

export const ADMIN_DASHBOARD = `${ADMIN_ROOT}/dashboard`

export const ADMIN_DOCUMENTS = `${ADMIN_ROOT}${DOCUMENTS}`
export const ADMIN_DOCUMENT = `${ADMIN_DOCUMENTS}/:id`
export const ADMIN_DOCUMENT_CONTENT = `${ADMIN_DOCUMENT}/content`

export const ADMIN_USERS = `${ADMIN_ROOT}/users`
export const ADMIN_USER = `${ADMIN_USERS}/:id`

export const ADMIN_ROLES = `${ADMIN_ROOT}/roles`
export const ADMIN_ROLE = `${ADMIN_ROLES}/:id`

export const ADMIN_GROUPS = `${ADMIN_ROOT}/groups`
export const ADMIN_GROUP = `${ADMIN_GROUPS}/:id`

export const ADMIN_DICTIONARY = `${ADMIN_ROOT}/dictionary`
export const ADMIN_DICTIONARY_TERMS = `${ADMIN_DICTIONARY}/terms`
export const ADMIN_DICTIONARY_TERM = `${ADMIN_DICTIONARY_TERMS}/:id`
export const ADMIN_DICTIONARY_ANALYSIS = `${ADMIN_DICTIONARY}/analysis`

export const ADMIN_RECORDS = `${ADMIN_ROOT}/records`
export const ADMIN_RECORD = `${ADMIN_RECORDS}/:id`
