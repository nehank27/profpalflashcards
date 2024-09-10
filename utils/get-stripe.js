import {loadStripe} from '@stripe/stripe-js'

let StripePromise
const getStripe = () => {
    if(!stripePromise) {
        stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)
    }
    return StripePromise

}
export default getStripe