// const refreshToken = require('../users-handler/refresh');
const updateContributions = require('../users-handler/contributions');

const handleCreateRestaurant = (knex) => async (req, res) => {
	const { restaurantName, 
        restaurantAddress, restaurantCity, restaurantRegion, restaurantCountry, restaurantPostalCode, 
        restaurantPhone, restaurantWebsite, restaurantType, restaurantCuisine,
        breakfast, brunch, lunch, dinner,
        restaurantWifi, restaurantTakeout, restaurantDelivery, restaurantPungent } = req.body;

	if (!restaurantName || !restaurantAddress || !restaurantRegion || !restaurantCountry || !restaurantPhone){
		return res.status(400).json('incorrect form submission');
	};
    
    try {
        await knex('users').select('user_id')
        .where('user_id', '=', req.userId)
        .then(data => {
            return knex('restaurants').insert({
                restaurant_name: restaurantName,
                address: restaurantAddress,
                city: restaurantCity,
                region: restaurantRegion,
                country: restaurantCountry,
                postal_code: restaurantPostalCode,
                phone: restaurantPhone,
                website: restaurantWebsite,
                type: restaurantType,
                cuisine: restaurantCuisine,
                breakfast: breakfast,
                brunch: brunch,
                lunch: lunch,
                dinner: dinner,
                free_wifi: restaurantWifi,
                takeout: restaurantTakeout,
                delivery: restaurantDelivery,
                exclude_pungent: restaurantPungent,
                overall_rate: 0,
                food_rate: 0,
                service_rate: 0,
                value_rate: 0,
                atmosphere_rate: 0,
                price_range: 0,
                review_count: 0,
                create_at: new Date(),
                create_by: data[0].user_id,
                last_modified_by: data[0].user_id
            })
            .returning('*')
            .then(restaurant => {
                updateContributions.addContribution(knex, req.userId);
                // const token = refreshToken.refresh(req.exp, req.userId, req.token);
                //     if (!token) {
                //         res.status(400).json('token expired');
                //     }
                return res.status(200).json({ data: restaurant[0] });
            })
            .catch(err => res.status(400).json({ error: 'unable to insert new data' }))
        });
    } catch (err) {
        res.status(400).json(err);
    }
};

module.exports = {
    handleCreateRestaurant: handleCreateRestaurant
};