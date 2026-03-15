import { avatarResolvers } from "./avatar.js";
import { cleanResponseResolvers } from "./cleanResponse.js";
import { countryResolvers } from "./country.js";
import { customerResolvers } from "./customer.js";
import { customerLanguageResolvers } from "./customerLanguage.js";
// import { fundsResolvers } from "./funds.js";
import { fundsResolvers } from "./fund/fund.resolvers.js";
import { funspotResolvers } from "./funspot.js";
import { languageResolvers } from "./language.js";
import { notificationResolvers } from "./notification.js";
import { paypalResolvers } from "./paypal.js";
import { requestResolvers } from "./request.js";
import { responseResolvers } from "./response.js";
import { templateResolvers } from "./template.js";
import { transactionResolvers } from "./transaction.js";
export default {
    Query: {
        ...avatarResolvers.Query,
        ...cleanResponseResolvers.Query,
        ...countryResolvers.Query,
        ...customerResolvers.Query,
        ...customerLanguageResolvers.Query,
        ...fundsResolvers.Query,
        ...funspotResolvers.Query,
        ...notificationResolvers.Query,
        ...requestResolvers.Query,
        ...languageResolvers.Query,
        ...responseResolvers.Query,
        ...templateResolvers.Query,
        ...transactionResolvers.Query,
        ...paypalResolvers.Query,
    },
    Mutation: {
        ...avatarResolvers.Mutation,
        ...cleanResponseResolvers.Mutation,
        ...countryResolvers.Mutation,
        ...customerResolvers.Mutation,
        ...customerLanguageResolvers.Mutation,
        ...fundsResolvers.Mutation,
        ...languageResolvers.Mutation,
        ...notificationResolvers.Mutation,
        ...paypalResolvers.Mutation,
        ...requestResolvers.Mutation,
        ...responseResolvers.Mutation,
        ...templateResolvers.Mutation,
        ...transactionResolvers.Mutation,
        ...funspotResolvers.Mutation,
    },
    Subscription: {
        ...avatarResolvers.Subscription,
        ...cleanResponseResolvers.Subscription,
        ...countryResolvers.Subscription,
        ...customerResolvers.Subscription,
        ...customerLanguageResolvers.Subscription,
        ...fundsResolvers.Subscription,
        ...languageResolvers.Subscription,
        ...notificationResolvers.Subscription,
        ...paypalResolvers.Subscription,
        ...requestResolvers.Subscription,
        ...responseResolvers.Subscription,
        ...templateResolvers.Subscription,
        ...transactionResolvers.Subscription,
        ...funspotResolvers.Subscription,
    },
};
