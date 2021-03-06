import React, {Component} from 'react';
import {Toolbar, NavItem, Space} from 'rebass';
import classNames from 'classnames';
import scrollTo from 'scroll-to';

import 'react-select/dist/react-select.css';
import './App.css';

import {querySocrata, querySocrataCounts} from './helpers/api';
import Search from './Search';
import Intake from './Intake';
import Pagination from './Pagination';

const DefaultPagination = {limit: 10, offset: 0, count: 0};

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      intakes: [],
      pagination: DefaultPagination,
      search: {},
      loading: true,
    };
  }

  componentDidMount() {
    this.loadIntakes();
  }

  setCurrentFilters = (filters) => {
    this.setState({currentFilters: filters});
  }

  loadIntakes = (search) => {
    this.setState({search, pagination: {...DefaultPagination}}, () => {
      this.refresh();
      querySocrataCounts('https://data.austintexas.gov/resource/fdzn-9yqv.json', this.state.search, this.state.pagination)
        .then((count) => this.setPaginationCount(count));
    });
  }

  refresh() {
      scrollTo(0, 0, {duration: 100});
      this.setState({loading: true});
      querySocrata('https://data.austintexas.gov/resource/fdzn-9yqv.json', this.state.search, this.state.pagination)
        .then((data) => this.setState({intakes: data, loading: false}));
  }

  setPaginationCount = (count) => {
    this.setState({pagination: {
        ...DefaultPagination,
        count,
    }});
  }

  toNextPage = () => {
    const {pagination} = this.state;
    this.setState({pagination: {
        ...pagination,
        offset: pagination.offset + pagination.limit,
    }}, () => this.refresh());

  }

  toPreviousPage = () => {
    const {pagination} = this.state;
    this.setState({pagination: {
        ...pagination,
        offset: pagination.offset - pagination.limit,
    }}, () => this.refresh());
  }

  applySearch = (search) => {
    this.loadIntakes(search);
  }

  render() {
    return (
      <div className="App">
        <div className="Header">
          <Toolbar backgroundColor="#f5f6f7" color="default">
            <NavItem color="primary">Intakes</NavItem>
            <NavItem>Outcomes</NavItem>
            <NavItem>Intake Map</NavItem>
            <Space x={1} auto />
            <NavItem>
              <a
                href="https://www.austintexas.gov/department/aac"
                style={{'text-decoration': 'none'}}
              >
                Austin Animal Center
              </a>
            </NavItem>
          </Toolbar>
        </div>
        <div className="Content">
          <Search onChange={this.applySearch} />
          <div className={classNames('SearchResults', {loading: this.state.loading})}>
            {this.state.pagination.count === 0 && (
              <div className="NoResults">
                {this.state.loading ? 'Loading...' : 'No results found.'}
              </div>
            )}
            {this.state.intakes && this.state.intakes.map((intake) => (
              <Intake intake={intake} key={intake.animal_id}/>
            ))}
          </div>
          <Pagination
            {...this.state.pagination}
            toNextPage={this.toNextPage}
            toPreviousPage={this.toPreviousPage}
          />
        </div>
      </div>
    );
  }
}
