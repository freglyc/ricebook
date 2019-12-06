import React from "react";
import { connect } from "react-redux";
import {getArticles, getFollowing, getOtherAvatar, getOtherDisplay, updateArticle} from "../../redux/actions";
import '../../style.css';

function mapDispatchToProps(dispatch) {
    return {
        getArticles: () => dispatch(getArticles()),
        getFollowing: () => dispatch(getFollowing()),
        updateArticle: (postId, update) => dispatch(updateArticle(postId, update))
    };
}

const mapStateToProps = state => {
    return {
        articles: state.articles
    };
};

class Articles extends React.Component {

    componentDidMount() {
        this.props.getFollowing().then(() => this.props.getArticles());
    }

    render() {
        return (
            <div className="posts">
                { this.props.articles === undefined || this.props.articles.length === 0 ? <p id="no-posts">There's nothing here ¯\_(ツ)_/¯</p> : this.props.articles.map(article => (<ConnectedArticle key={article["_id"]} article={article}/>)) }
            </div>
        )
    }
}

class Article extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            author: '',
            avatar: '',
            comment: ''
        };
        this.addComment = this.addComment.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        getOtherDisplay(this.props.article['author']).then(res => (this._isMounted) ? this.setState({ author: res }) : "");
        getOtherAvatar(this.props.article['author']).then(res => (this._isMounted) ? this.setState({ avatar: res }) : "");
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    addComment(event) {
        event.preventDefault();
        this.props.updateArticle(this.props.article['_id'], {
            'text': this.state.comment,
            'commentId': '-1'
        });
        event.target.reset();
    }

    handleChange(event) { this.setState({ comment: event.target.value }); }

    render() {
        return (
            <div className="status-card" id="post">
                <div id="post-top">
                    <div id="post-info">
                        <img id="post-img" src={this.state.avatar} alt="profile img"/>
                        <div id="post-user-info">
                            <p id="post-name">{this.state.author}</p>
                            <p id="post-date">{new Date(this.props.article['date']).toDateString()}</p>
                        </div>
                    </div>
                    <input id="post-edit" type="image" src={require("../../resources/new-post.svg")} alt="edit post"/>
                </div>
                <p id="post-title">
                    {this.props.article["title"]}
                </p>
                <p id="post-txt">
                    {this.props.article["body"]}
                </p>
                {this.props.article["picture"] !== '' ? <img id="post-photo" src={this.props.article["picture"]} alt="img post"/> : <span/>}
                <Comments comments={this.props.article['comments']}/>
                <form onSubmit={this.addComment}>
                    <input id="post-comment" type="text" placeholder="comment" onChange={this.handleChange}/>
                    <input type="submit" className="hidden"/>
                </form>
            </div>
        )
    }
}

class Comments extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            collapsed: true
        };
        this.handleClick = this.handleClick.bind(this);
    }


    handleClick(event) {
        event.preventDefault();

        this.setState({
            collapsed: !this.state.collapsed
        })
    }

    render() {
        return (
            <div id="comments">
                <input id="collapse" type="button" value={this.state.collapsed ? "view comments" : "hide comments"} onClick={this.handleClick}/>
                <div>
                    {this.state.collapsed ? "" : this.props.comments.map(comment => <ConnectedComment key={comment['_id']} comment={comment}/>)}
                </div>
            </div>
        )
    }
}


class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            author: '',
            avatar: ''
        }
    }

    componentDidMount() {
        getOtherDisplay(this.props.comment['author']).then(res => this.setState({ author: res }));
        getOtherAvatar(this.props.comment['author']).then(res => this.setState({ avatar: res }));
    }

    render() {
        return (
            <div className="comment">
                <img src={this.state.avatar} alt="profile img"/>
                <p><b>{this.state.author}</b> {this.props.comment['body']}</p>
            </div>
        )
    }
}
const ConnectedArticle = connect(mapStateToProps, mapDispatchToProps)(Article);

const ConnectedComment = connect(mapStateToProps, mapDispatchToProps)(Comment);

export default connect(mapStateToProps, mapDispatchToProps)(Articles);