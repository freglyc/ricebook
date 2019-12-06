import React from "react";
import { connect } from "react-redux";
import { postArticle } from "../../redux/actions";
import '../../style.css';

const mapStateToProps = state => {
    return { username: state.username };
};
function mapDispatchToProps(dispatch) {
    return { postArticle: article => dispatch(postArticle(article)) };
}

class NewPost extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            image: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        let fd = new FormData();
        fd.append('title', document.getElementById("new-post-title").value);
        fd.append('body', document.getElementById("new-post-body").value);
        if (this.state.image !== '') fd.append('image', this.state.image);
        this.props.postArticle(fd);
        this.setState({ image: '' });
        document.getElementById("new-post-form").reset();
    }

    handleImageChange(event) {
        const file = event.target.files[0];
        if (file.type === 'image/jpeg') this.setState({ image: file });
    }

    render() {
        return (
            <div className="status-card" id="new-post">
                <form id="new-post-form" onSubmit={this.handleSubmit}>
                    <div id="new-post-top">
                        <p className="header-txt">New Post</p>
                        <span id="img-upload">
                            <label htmlFor="upload-btn">
                                <img id="new-post-add-image" src={require("../../resources/add-image.svg")} alt="add pic"/>
                            </label>
                            <input id="upload-btn" type="file" accept="image/*" onChange={this.handleImageChange}/>
                        </span>
                    </div>
                    <div id="new-post-added-img">
                        {/*  inject some html here  when adding an image */}
                    </div>
                        <input id="new-post-title" required type="text" placeholder="title" maxLength={50}/>
                        <textarea id="new-post-body" required rows="7" cols="50" placeholder="write something"/>
                    <div id="new-post-bot">
                        <input type="submit" id="new-post-post-btn" value="post"/>
                        <input type="reset" id="new-post-cancel-btn" value="cancel"/>
                    </div>
                </form>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewPost);