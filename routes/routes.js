import { Router } from "express";
import controller from '../controllers/controller.js'

import express from "express";
const router = express.Router();

router.get(`/`, controller.getIndex);
router.get(`/indexLog`, controller.getIndexLog);

router.get(`/loginPage`, controller.getLoginPage);
router.post(`/loginPage`, controller.postLoginPage);

router.get(`/restaurant`, controller.getRestaurant);
router.get(`/restaurantLogout`, controller.getRestaurantLogout);

router.get(`/reviewPage`, controller.getReviewPage);
router.post(`/reviewPage`, controller.postReviewPage);

router.get(`/restoView`, controller.getRestoView);
router.post(`/restoView`, controller.postRestoView);

router.get(`/RestoOut`, controller.getRestoOut);

router.post(`/DeleteReview`, controller.postDeleteReview);

router.get(`/registrationPage`, controller.getRegistrationPage);
router.post(`/registrationPage`, controller.postRegistrationPage);

router.get(`/searchPage`, controller.getSearchPage);
router.post(`/searchPage`, controller.postSearchPage);

router.post(`/searchPageFilter`, controller.postSearchPageFilter);
router.post(`/SearchPageLogoutFilter`, controller.postSearchPageLogoutFilter);

router.get(`/searchPageLogout`, controller.getSearchPageLogout);
router.post(`/searchPageLogout`, controller.postSearchPageLogout);

router.get(`/editProfile`, controller.getEditProfile);
router.post(`/editProfile`, controller.postEditProfile);

router.get(`/viewProfileU1`, controller.getViewProfileU1);
router.get(`/visitProfile`, controller.getVisitProfile);

router.get(`/loadReactionPost`, controller.getLoadReactionPost);
router.get(`/loadReactionPostMin`, controller.getLoadReactionPost);
router.post(`/reactionPost`, controller.postReactionPost);

export default router;