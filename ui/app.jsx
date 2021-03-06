class Card extends React.Component {
  render() {
    return (
      <p>
        <h4>{this.props.title}</h4>
        <img className='card' src={this.props.url} alt={this.props.title} />
      </p>
    )
  }
}

class SearchResults extends React.Component {
  render() {
    if (this.props.results.length == 0) {
      return (
        <p>Sorry, no results.</p>
      );
    } else {
      return(
        <div>
          {this.props.results.map(item =>
            <Card title={item.title} url={item.url} />
          )}
        </div>
      );
    }
  }
}

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    this.props.onSearchInput(event.target.value);
  }

  handleSubmit(event) {
    this.props.onSearchSubmit(event);
  }

  render() {
    return (
      <ReactBootstrap.Form horizontal>
        <ReactBootstrap.FormGroup>
          <ReactBootstrap.Col sm={11}>
            <ReactBootstrap.FormControl
              autoFocus="true"
              type="text"
              placeholder="Search..."
              value={this.props.searchInput}
              onChange={this.handleInputChange}
            />
          </ReactBootstrap.Col>
          <ReactBootstrap.Col sm={1}>
            <ReactBootstrap.Button
              type="submit"
              onClick={this.handleSubmit}>
              Search
            </ReactBootstrap.Button>
          </ReactBootstrap.Col>
        </ReactBootstrap.FormGroup>
      </ReactBootstrap.Form>
    );
  }
}


class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: '',
      results: null,
    };

    this.handleSearchInput = this.handleSearchInput.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
  }

  handleSearchInput(searchInput) {
    this.setState({searchInput: searchInput});
  }

  handleSearchSubmit(event) {
    event.preventDefault();
    if (this.state.searchInput.length == 0) {
      return;
    }

    // this piece of code assumes certain naming conventions
    // of the backend services
    var hostname = window.location.hostname
    var postfix = hostname.substring(hostname.indexOf("-"));

    fetch('https://api' + postfix + "/api/v1.0/search/" + this.state.searchInput)
      .then(result=>result.json())
      .then(items=>this.setState({results: items}));
  }

  render() {
    let searchResults;
    let searchClass;
    let logoClass;
    if(this.state.results != null) {
        searchResults = <SearchResults results={this.state.results} />
        searchClass = null
        logoClass = null
    } else {
        searchResults = null
        searchClass = 'search-center'
        logoClass = 'logo-large'
    }
    return (
      <div className={searchClass}>
        <h3 className={logoClass}>CatCatGo</h3>
        <SearchBar
          searchInput={this.state.searchInput}
          onSearchInput={this.handleSearchInput}
          onSearchSubmit={this.handleSearchSubmit}
        />
        <br />
        {searchResults}
      </div>
    );
  }
}

ReactDOM.render(
  <SearchForm />,
  document.getElementById('container')
);
