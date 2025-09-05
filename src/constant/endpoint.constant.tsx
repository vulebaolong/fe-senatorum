export const ENDPOINT = {
    AUTH: {
        LOGIN: `/auth/login`,
        CREATE_MAGIC_LINK: `/auth/create-magic-link`,
        VERIFY_MAGIC_LINK: `/auth/verify-magic-link`,
        LOGIN_GOOGLE_ONE_TAP: `/auth/google/one-tap`,
        LOGIN_GOOGLE: `/auth/login-google`,
        REGISTER: `/auth/register`,
        REFRESH_TOKEN: `/auth/refresh-token`,
        REFRESH_TOKEN_COOKIE: `/auth/refresh-token-cookie`,
        GET_INFO: `/auth/get-info`,
        FACEBOOK_LOGIN: `/auth/facebook-login`,
        RESET_PASSWORD: `/auth/reset-password`,
        SEND_EMAIL: `/auth/send-email`,
        PROFILE_BY_USERNAME: `/auth/get-profile`,
    },
    ROLE: {
        ROLE: `/role`,
        TOGGLE_ROLE: `/role/toggle`,
    },
    PERMISSION: {
        PERMISSION: `/permission`,
        LIST_PERMISSION_BY_ROLE: `/permission/list-by-role`,
    },
    ROLE_PERMISSION: {
        TOGGLE_ROLE_PERMISSION: `/role-permission/toggle`,
    },
    ARTICLE: {
        ARTICLE: "/article",
        ARTICLE_ALL: "/article/all",
        ARTICLE_MY: "/article/my",
        ARTICLE_MY_UPVOTED: "/article/my-upvoted",
        ARTICLE_MY_BOOKMARKED: "/article/my-bookmarked",
        ARTICLE_OTHER: "/article/other",
        ARTICLE_UPSERT_DRAFT: "/article/upsert-draft",
        ARTICLE_UPSERT_EDIT: "/article/upsert-edit",
        ARTICLE_EDIT: "/article/edit",
        ARTICLE_GET_DRAFT: "/article/draft",
        ARTICLE_UPSERT_THUMBNAIL: "/article/upsert-thumbnail",
        ARTICLE_PUBLISH: "/article/publish",
        ARTICLE_DELETE: "/article/delete",
    },
    ARTICLE_BOOKMARK: {
        ARTICLE_BOOKMARK_ALL: "/article-bookmark",
        ARTICLE_TOGGLE_BOOKMARK: "/article-bookmark/toggle-article-bookmark",
        ADD_BOOKMARK: "/article-bookmark/add",
        REMOVE_BOOKMARK: "/article-bookmark/remove",
    },
    ARTICLE_VIEW: {
        ARTICLE_VIEW: "/article-view",
    },
    CHAPTER: {
        CHAPTER: "/chapter",
        CHAPTER_ALL: "/chapter/all",
        CHAPTER_OTHER: "/chapter/other",
        CHAPTER_UPSERT: "/chapter/upsert",
        CHAPTER_GET_DRAFT: "/chapter/draft",
        CHAPTER_UPSERT_THUMBNAIL: "/chapter/upsert-banner",
        CHAPTER_PUBLISH: "/chapter/publish",
    },
    COMMENT: {
        COMMENT: "/comment",
    },
    USER: {
        USER: "/user",
        USER_EDIT_PROFILE: "/user/edit-profile",
        UPLOAD_AVATAR: "/user/upload-avatar",
        DELETE_AVATAR: "/user/delete-avatar",
        UPLOAD_AVATAR_DRAFT: "/user/upload-avatar-draft",
        DELETE_AVATAR_DRAFT: "/user/delete-avatar-draft",
        UPLOAD_BANNER: "/user/upload-banner",
        DELETE_BANNER: "/user/delete-banner",
        UPLOAD_BANNER_DRAFT: "/user/upload-banner-draft",
        DELETE_BANNER_DRAFT: "/user/delete-banner-draft",
    },
    CHAT_GROUP: {
        CHAT_GROUP: "/chat-group",
    },
    CHAT_MESSAGE: {
        CHAT_MESSAGE: "/chat-message",
    },
    TOTP: {
        GENERATE: "/totp/generate",
        VERIFY: "/totp/verify",
        SAVE: "/totp/save",
        DISABLE: "/totp/disable",
    },
    TYPE: {
        TYPE: "/type",
    },
    CATEGORY: {
        CATEGORY: "/category",
    },
    IMAGE: {
        DRAFT: "/image/upload-draft",
        DELETE: "/image/delete-draft",
    },
    ARTICLE_VOTE: {
        ARTICLE_VOTE: "/article-vote",
    },
    FOLLOW: {
        FOLLOW: "/follow",
        UN_FOLLOW: "/follow",
        GET_COUNT_FOLLOW: "/follow/counts",
        GET_IS_FOLLOW: "/follow/is-following",
    },
    NOTIFICATION: {
        NOTIFICATION: "/notification",
        COUNT_UNREAD_NOTIFICATION: "/notification/count-unread",
        READ_NOTIFICATION: "/notification/read",
    },
    SETTING_SYSTEM: {
        SETTING_SYSTEM: "/setting-system",
    }
};
