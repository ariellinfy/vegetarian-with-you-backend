const handleRequestRestaurantReviewsWithAuth = (knex) => async (req, res) => {
    const parts = req.query.sortBy.split(':');

    if (req.query.restaurantId && req.userId) {
        try {
            await knex('reviews').select('reviews.*', 'user_feedbacks.user_helpful', 'users.public_name', 'users.avatar', 'users.contributions', 'users.helpful_votes')
            .leftJoin('user_feedbacks', function() {
                this.on('user_feedbacks.review_id', '=', 'reviews.review_id').andOn('user_feedbacks.user_id', knex.raw('?', [req.userId]))
            })
            .leftJoin('users', 'reviews.review_owner', 'users.user_id')
            .where('reviews.restaurant_id', '=', req.query.restaurantId)
            .orderBy(parts[0], parts[1])
            .then(data => {
                return res.status(200).json({ reviews: data });
            })
            .catch(err => res.status(400).json({ error: 'Unable to fetch reviews with auth, app under maintenance.' }))
        } catch (e) {
            console.log(e);
            return res.status(400).json({ error: 'Fail to request reviews with auth, app under maintenance.' });
        }
    } else {
        return res.status(400).json({ error: 'Query missing restaurant id and/or user id, app under maintenance.' });
    }
};

module.exports = {
    handleRequestRestaurantReviewsWithAuth: handleRequestRestaurantReviewsWithAuth
};