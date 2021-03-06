import DetailsView from "../views/DetailsView";
import { connect } from "react-redux";
import { addToPlaylist, removeFromPlaylist } from "../../redux/actions";
import React, { Component } from "react";
import ApiHandler from "../../apiHandler";
import promiseNoData from "../views/promiseNoData";

class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lyrics: "",
      loading: false,
      err: null,
    };
    this.addToPlaylist = this.addToPlaylist.bind(this);
  }

  componentDidMount() {
    if (this.props.token !== undefined) {
      if (this.props.track) {
        this.setState({
          loading: true,
        });

        ApiHandler.fetchLyrics(this.props.track.title, this.props.track.artist)
          .then((res) => {
            this.setState({ lyrics: res, loading: false });
          })
          .catch((err) => {
            this.setState({ err: err });
          });
      }
    }
  }
  addToPlaylist(track) {
    this.setState({ loading: true });
    setTimeout(() => {
      this.props.addToPlaylist(track);
    }, 1000);
    this.setState({ loading: false });
  }
  render() {
    return (
      promiseNoData(this.state.loading, this.state.lyrics, this.state.err) ||
      React.createElement(DetailsView, {
        track: this.props.track,
        addToPlaylist: (track) => {
          this.addToPlaylist(track);
        },
        removeFromPlaylist: (trackID) => this.props.removeFromPlaylist(trackID),
        isTrackInPlaylist: this.props.isTrackInPlaylist,
        playlist: this.props.playlist,
        lyrics: this.state.lyrics,
        token: this.props.token,
      })
    );
  }
}

const mapStateToProps = (state) => {
  return {
    track: state.current_track,
    playlist: state.playlist,
    isTrackInPlaylist: state.playlist.some(
      (track) => track.id === state.current_track.id
    ),
    token: state.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToPlaylist: (track) => dispatch(addToPlaylist(track)),
    removeFromPlaylist: (trackID) => dispatch(removeFromPlaylist(trackID)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Details);
