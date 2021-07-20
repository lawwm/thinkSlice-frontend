import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "../../../util/test-utils";

import ReviewPost from "../../../components/ReviewPost";
import userEvent from "@testing-library/user-event";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
//yarn run test -- --coverage --watchAll=false

describe("Review Post", () => {
  describe("Review Post UI component should work", () => {
    describe("Review post of user as tutor", () => {
      let history;
      beforeEach(() => {
        history = createMemoryHistory();
        render(
          <Router history={history}>
            <ReviewPost
              reviewId={1}
              reviewPic={"src"}
              username={"John"}
              reviewTitle={"Good"}
              reviewEssay={"Very good"}
              dateReview={"13-6-2021"}
              editedDateReview={"13-6-2021"}
              starRating={4}
              subjects={["Math"]}
              edited={false}
              viewerId={"2"}
              profileId={3}
              reviewerId={2}
              asTutor={true}
            />
          </Router>,
          {
            initialState: {
              auth: {
                token: null,
                isAuthenticated: true,
                loading: false,
                user: 1,
                username: null,
                authLoading: false,
              },
              profile: {
                profile: {
                  basic: {
                    id: 25,
                    profile_pic:
                      "https://thinkslice-project.s3.amazonaws.com/user-images/427ed110edb63dbe449c5a8aaefa4ca9_pe9mMiy.jpg?AWSAccessKeyId=AKIA3EDWA4JQ57MY2PM5&Signature=8liLIhwzXEJzzTsZBGgI40QPNKI%3D&Expires=1623590786",
                    username: "jimijam",
                    user_bio: "Hi, welcome to my profile! Cool profilez",
                    is_tutor: true,
                    is_student: true,
                    user: 1,
                    video: [
                      {
                        id: 2,
                        video_title: "Learn physics",
                        video_description:
                          "Quantum physics is a popular phrase used nowadays, but what is it about? Learn the  basics of quantum physics today!",
                        subject: "Physics",
                        views: 404,
                        likes: 1,
                        num_of_comments: 6,
                        asset_id:
                          "HcDHzBMgnn39HOx02Mv9qcO1HONggk6lJwxVwjHQwjhQ",
                        playback_id:
                          "kGCiZbuXRxBbe6yIUQFIWaG5EplDTyInrca01DX1GrvM",
                        duration: 0,
                        policy: "public",
                        created_at: "9 days ago",
                        creator_profile: 25,
                      },
                    ],
                  },
                  detailed: {
                    tutor_whatsapp: 12345678,
                    tutor_telegram: "@jimijam",
                    aggregate_star: null,
                    location: "South",
                    duration_classes: [5, 8],
                    subjects: [
                      "Math",
                      "Cooking",
                      "Biology",
                      "Business",
                      "Computing",
                    ],
                    total_tutor_reviews: 0,
                    qualifications: "P6 tutor",
                  },
                },
                profileLoading: false,
                profileComponentLoading: false,
                reviewLoading: false,
                reviewPostLoading: false,
                detailedMode: true,
                editMode: false,
                reviewsGiven: [
                  {
                    id: 49,
                    star_rating: 5,
                    review_title: "Amazing teacher, truly the best",
                    review_essay: "Great mentor! Super",
                    date_review: "2021-06-06",
                    date_review_edited: "2021-06-13",
                    edited: true,
                    tutor_profile: 30,
                    student_profile: 25,
                    creator_details: {
                      profile_pic:
                        "https://thinkslice-project.s3.amazonaws.com/user-images/download.jpg?AWSAccessKeyId=AKIA3EDWA4JQ57MY2PM5&Signature=K5iHfrsRgdWiQ1OFlYppkcXbl2Y%3D&Expires=1623573187",
                      username: "tim",
                      user: 31,
                    },
                  },
                ],
                reviewsReceived: [],
              },
            },
          }
        );
      });

      it(`tutor's review renders`, () => {
        expect(screen.getByText("John")).toBeInTheDocument();
        expect(screen.getByText("Good")).toBeInTheDocument();
        expect(screen.getByText("Math")).toBeInTheDocument();
        expect(screen.getByText("Very good")).toBeInTheDocument();
      });

      it("redirects to user profile when clicking on profile picture", () => {
        //Click on profile picture
        userEvent.click(screen.getByAltText(/tutor profile picture/i));
        expect(history.location.pathname).toBe("/profile/3");
      });

      it("viewer cannot exit edit modal by clicking outside body", async () => {
        //Open edit modal
        userEvent.click(
          screen.getByRole("button", { name: "show edit modal" })
        );
        expect(screen.queryByText(/edit review/i)).toBeInTheDocument();

        //Cannot exit edit modal by clicking outside body
        userEvent.click(document.body);
        expect(screen.queryByText(/edit review/i)).toBeInTheDocument();

        //Exits modal when clicking close button
        userEvent.click(
          screen.getByRole("button", { name: /close edit modal/i })
        );
        await waitForElementToBeRemoved(screen.queryByText(/edit review/i));
        expect(screen.queryByText(/edit review/i)).not.toBeInTheDocument();
      });

      it("viewer who owns the review post can use edit modal", async () => {
        //Edit modal not open
        expect(screen.queryByText(/edit review/i)).not.toBeInTheDocument();

        //User can see open edit modal button and click it
        expect(
          screen.getByRole("button", { name: "show edit modal" })
        ).toBeInTheDocument();
        userEvent.click(
          screen.getByRole("button", { name: "show edit modal" })
        );
        expect(screen.queryByText(/edit review/i)).toBeInTheDocument();

        //User can change edit review inputs
        expect(screen.getAllByTestId("star")).toHaveLength(5);
        userEvent.click(screen.getAllByTestId("star")[3]);
        //There are already 4 display stars, and 4 application stars clicked
        expect(screen.getAllByTestId("filled")).toHaveLength(8);
        //Changing edit modal inputs
        userEvent.type(
          screen.getByPlaceholderText(/title/i),
          "title test edit"
        );
        expect(screen.getByPlaceholderText(/title/i)).toHaveValue(
          "Goodtitle test edit"
        );
        userEvent.type(
          screen.getByPlaceholderText(/description/i),
          "description test edit"
        );
        expect(screen.getByPlaceholderText(/description/i)).toHaveValue(
          "Very gooddescription test edit"
        );

        userEvent.click(
          screen.getByRole("button", { name: "submit edit modal" })
        );
        await waitForElementToBeRemoved(screen.queryByText(/edit review/i));
        expect(screen.queryByText(/edit review/i)).not.toBeInTheDocument();
      });

      it("viewer cannot exit delete modal by clicking outside body", async () => {
        //Open delete modal
        userEvent.click(
          screen.getByRole("button", { name: "show delete modal" })
        );
        expect(screen.queryByText(/delete review/i)).toBeInTheDocument();

        //Cannot exit delete modal by clicking outside body
        userEvent.click(
          screen.getByRole("button", { name: "close delete modal" })
        );
        await waitForElementToBeRemoved(screen.queryByText(/delete review/i));
        expect(screen.queryByText(/delete review/i)).not.toBeInTheDocument();
      });

      it("viewer can click delete button", async () => {
        //Open delete modal
        userEvent.click(
          screen.getByRole("button", { name: "show delete modal" })
        );
        expect(screen.queryByText(/delete review/i)).toBeInTheDocument();

        //Cannot exit delete modal by clicking outside body
        userEvent.click(
          screen.getByRole("button", { name: "submit delete modal" })
        );
        await waitForElementToBeRemoved(screen.queryByText(/delete review/i));
        expect(screen.queryByText(/delete review/i)).not.toBeInTheDocument();
      });
    });

    describe("Review post of user as student", () => {
      let history;
      beforeEach(() => {
        history = createMemoryHistory();
        render(
          <Router history={history}>
            <ReviewPost
              reviewId={1}
              reviewPic={"src"}
              username={"John"}
              reviewTitle={"Good"}
              reviewEssay={"Very good"}
              dateReview={"13-6-2021"}
              editedDateReview={"13-6-2021"}
              starRating={4}
              subjects={["Math"]}
              edited={true}
              viewerId={"2"}
              profileId={2}
              reviewerId={3}
              asTutor={false}
            />
          </Router>,
          {
            initialState: {
              auth: {
                token: null,
                isAuthenticated: true,
                loading: false,
                user: 1,
                username: null,
                authLoading: false,
              },
              profile: {
                profile: {
                  basic: {
                    id: 25,
                    profile_pic:
                      "https://thinkslice-project.s3.amazonaws.com/user-images/427ed110edb63dbe449c5a8aaefa4ca9_pe9mMiy.jpg?AWSAccessKeyId=AKIA3EDWA4JQ57MY2PM5&Signature=8liLIhwzXEJzzTsZBGgI40QPNKI%3D&Expires=1623590786",
                    username: "jimijam",
                    user_bio: "Hi, welcome to my profile! Cool profilez",
                    is_tutor: true,
                    is_student: true,
                    user: 1,
                    video: [
                      {
                        id: 2,
                        video_title: "Learn physics",
                        video_description:
                          "Quantum physics is a popular phrase used nowadays, but what is it about? Learn the  basics of quantum physics today!",
                        subject: "Physics",
                        views: 404,
                        likes: 1,
                        num_of_comments: 6,
                        asset_id:
                          "HcDHzBMgnn39HOx02Mv9qcO1HONggk6lJwxVwjHQwjhQ",
                        playback_id:
                          "kGCiZbuXRxBbe6yIUQFIWaG5EplDTyInrca01DX1GrvM",
                        duration: 0,
                        policy: "public",
                        created_at: "9 days ago",
                        creator_profile: 25,
                      },
                    ],
                  },
                  detailed: {
                    tutor_whatsapp: 12345678,
                    tutor_telegram: "@jimijam",
                    aggregate_star: null,
                    location: "South",
                    duration_classes: [5, 8],
                    subjects: [
                      "Math",
                      "Cooking",
                      "Biology",
                      "Business",
                      "Computing",
                    ],
                    total_tutor_reviews: 0,
                    qualifications: "P6 tutor",
                  },
                },
                profileLoading: false,
                profileComponentLoading: false,
                reviewLoading: false,
                reviewPostLoading: false,
                detailedMode: true,
                editMode: false,
                reviewsGiven: [
                  {
                    id: 49,
                    star_rating: 5,
                    review_title: "Amazing teacher, truly the best",
                    review_essay: "Great mentor! Super",
                    date_review: "2021-06-06",
                    date_review_edited: "2021-06-13",
                    edited: true,
                    tutor_profile: 30,
                    student_profile: 25,
                    creator_details: {
                      profile_pic:
                        "https://thinkslice-project.s3.amazonaws.com/user-images/download.jpg?AWSAccessKeyId=AKIA3EDWA4JQ57MY2PM5&Signature=K5iHfrsRgdWiQ1OFlYppkcXbl2Y%3D&Expires=1623573187",
                      username: "tim",
                      user: 31,
                    },
                  },
                ],
                reviewsReceived: [],
              },
            },
          }
        );
      });

      it("render by edited", () => {
        expect(screen.queryByText(/edited/i)).toBeInTheDocument();
      });
    });
  });
});
