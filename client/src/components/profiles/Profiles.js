import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { getProfiles } from "../../actions/profile";
import ProfileItem from "./ProfileItem";

const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {
  const [text, setText] = useState('')
  const [formData, setRenderedProfiles] = useState({
    renderedProfiles : []
  })
  useEffect(() => {
    const utilityfunc = async () => {
    await getProfiles();
    
    }
    utilityfunc();
  }, [getProfiles]);
  useEffect(() => {
    setRenderedProfiles({renderedProfiles : profiles})
  }, [profiles])



  const onChange = (e) => {
    e.preventDefault();
    const profileHolder = profiles.map(profile => profile.user.name)
    let placeholder = profiles.filter(profile => profile.user.name.substring(0, e.target.value.length).toUpperCase() === e.target.value.toUpperCase())
    setRenderedProfiles({renderedProfiles : placeholder})
    setText(e.target.value)
  }



  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary">Developers</h1>
          <p className="lead">
            <i className="fab fa-connectdevelop"></i> Browse and connect with
            developers!
          </p>
          <form className="searchBar" style = {{"border" : "1px solid #ccc", "paddingBottom " : "50px"}} onSubmit = {e => onChange(e)}>
            <input type="text" className="search" value = {text} onChange = {e => onChange(e)} style = {{"width" : "97%", "padding" : "0.4rem", "fontSize" : "1.2rem", "borderRight" : "1px solid #ccc", "marginBottom " : "50px", "display" : "inline"}}/> 
            <i className = "fas fa-search text-center justify-content-center" style={{
                  verticalAlign: "middle",
                  display: "inline",
                  lineHeight: "2.5"
                }}></i> 
          </form>
          <div className="profiles">

            {formData.renderedProfiles.length > 0 ? (
              formData.renderedProfiles.map(profile => (
                <ProfileItem key={profile._id} profile={profile} />
              ))
            ) : (
              <h4>No Profiles Found</h4>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
