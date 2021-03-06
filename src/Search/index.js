import React, {Component, PropTypes} from 'react';
import {Button, ButtonOutline} from 'rebass';
import Icon from 'react-geomicons';
import toArray from 'lodash/toArray';
import filter from 'lodash/filter';
import Guid from 'guid';

import SearchItem from './SearchItem';

import './Search.css';

const createNewSearch = () => ({
  id: Guid.create().value,
  searchField: 'animal_type',
  searchCondition: 'is',
  searchValue: null,
});

export default class Search extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const firstSearch = createNewSearch();

    this.state = {
      // FIXME: searches should be an array, not an object
      searches: {
        [firstSearch.id]: firstSearch,
      },
      showSearch: false,
    };
  }

  toggleSearch = () => {
    this.setState({showSearch: !this.state.showSearch});
  }

  setSearches = (newSearches) => {
    this.setState({searches: newSearches});
    this.props.onChange(newSearches);
  }

  updateSearch = (updatedSearch) => {
    this.setSearches({
      ...this.state.searches,
      [updatedSearch.id]: updatedSearch,
    });
  }

  removeSearchItem = (deletedSearch) => {
    const updated = filter(this.state.searches,
      (search) => search.id !== deletedSearch.id
    );
    this.setSearches(updated);
  }

  addSearchItem = () => {
    const newSearch = createNewSearch();
    this.setSearches({
      ...this.state.searches,
      [newSearch.id]: newSearch,
    });
  }

  render() {
    if (!this.state.showSearch) {
      return (
        <div className="Search">
          <div className="SearchButton">
            <Button onClick={this.toggleSearch}>
              <div className="Icon"><Icon name="search" /></div>
              Search Animals
            </Button>
          </div>
        </div>
      )
    }

    const sortedSearches = toArray(this.state.searches);

    return (
      <div className="Search">
        <div className="CloseButton">
          <ButtonOutline onClick={this.toggleSearch} theme="error">
            Close
          </ButtonOutline>
        </div>
        {sortedSearches.map((search, index) => (
          <SearchItem
            key={search.id}
            search={search}
            updateSearch={this.updateSearch}
            addSearchItem={this.addSearchItem}
            removeSearchItem={this.removeSearchItem}
            allowDelete={index !== 0}
          />
        ))}
      </div>
    );
  }
}
