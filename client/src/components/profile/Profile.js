import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { getProfileById } from "../../actions/profile";
import { Link } from "react-router-dom";
import ProfileTop from "./ProfileTop";
import ProfileAbout from "./ProfileAbout";
import ProfileExperience from "./ProfileExperience";
import ProfileEducation from "./ProfileEducation";
import ProfileGithub from "./ProfileGithub.js";
import {createChat} from '../../actions/chat'

const Profile = ({
  match,
  getProfileById,
  auth,
  profile: { profile, loading },
  createChat
}) => {
  useEffect(() => {
    getProfileById(match.params.id);
  }, [getProfileById, match.params.id]);
  
  //@todo
  //make sure when moving between profiles github repos get cleared

  return (
    <Fragment>
      {profile === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link to="/profiles" className="btn btn-light">
            Back To Profiles
          </Link>
          <Link to = "/chat" className = 'btn btn-primary' onClick = {e => {
            createChat(profile.user._id);
          }}>
            Chat with this Developer
          </Link>
          {auth.isAuthenticated &&
            auth.loading === false &&
            auth.user._id === profile.user._id && (
              <Link to="/edit-profile" className="btn btn-dark">
                Edit Profile
              </Link>
            )}
          <div className="profile-grid my-1">
            <ProfileTop profile={profile} />
                <ProfileAbout profile = {profile} />
            <div className="profile-exp bg-white p-2">
              <h2 className="text-primary">Experience</h2>
              {profile.experience.length > 0 ? (
                <Fragment>
                  {profile.experience.map((experience, index) => {
                    if(typeof experience === 'object') {
                      experience = [experience];
                    }
                    return (
                    <ProfileExperience
                      key={/*experience._id*/index}
                      experience={experience}
                    />
                  )})}
                </Fragment>
              ) : (
                <h4>No experience credentials</h4>
              )}
            </div>
            <div className="profile-edu bg-white p-2">
              <h2 className="text-primary">Education</h2>
              {profile.education.length > 0 ? (
                <Fragment>
                  {profile.education.map((education, index) => {
                    if(typeof education === 'object') {
                      education = [education];
                    }
                    return (
                    <ProfileEducation
                      key={/*education._id*/index}
                      education={education}
                    />
                  )})}
                </Fragment>
              ) : (
                <h4>No education credentials</h4>
              )}
            </div>
            {profile.githubusername && (
                <ProfileGithub username = {profile.githubusername}/>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  createChat : PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(mapStateToProps, { getProfileById, createChat })(Profile);
