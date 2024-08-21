import React, { useReducer, useEffect } from "react";
import data from "../data/colleges.json";
import InfiniteScroll from "react-infinite-scroll-component";
import _ from "lodash";

// Initial state for the reducer
const initialState = {
  colleges: data.slice(0, 10),
  hasMore: true,
  searchTerm: "",
  sortConfig: null,
};

// Reducer function to manage state transitions
const collegeReducer = (state, action) => {
  switch (action.type) {
    case "LOAD_MORE":
      const moreColleges = data.slice(
        state.colleges.length,
        state.colleges.length + 10
      );
      return {
        ...state,
        colleges: [...state.colleges, ...moreColleges],
        hasMore: state.colleges.length + moreColleges.length < data.length,
      };
    case "SEARCH":
      return {
        ...state,
        searchTerm: action.payload,
      };
    case "SORTING":
      return {
        ...state,
        sortConfig: {
          key: action.payload.key,
          direction: action.payload.direction,
        },
      };
    default:
      return state;
  }
};


// Table Component
const Table = () => {
  const [state, dispatch] = useReducer(collegeReducer, initialState);

  // Effect to handle infinite scroll
  useEffect(() => {
    if (state.colleges.length >= data.length) {
      dispatch({ type: "LOAD_MORE", payload: false });
    }
  }, [state.colleges.length]);      // here mount and updates when there is a change in colleges length

  // Handle search input
  const handleSearch = (e) => {
    dispatch({ type: "SEARCH", payload: e.target.value });
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (state.sortConfig && state.sortConfig.key === key && state.sortConfig.direction === "asc") {
      direction = "desc";
    }
    dispatch({type: "SORTING", payload: { key, direction }});
  };

  // Filter and sort colleges based on the search term and sort configuration
  const filteredAndSortedColleges = _.orderBy(
    state.colleges.filter((college) =>
      college.name.toLowerCase().includes(state.searchTerm.toLowerCase())
    ),
    [state.sortConfig?.key],
    [state.sortConfig?.direction]
  );

  // Fetch more data for infinite scroll
  const fetchMoreData = () => {
    dispatch({ type: "LOAD_MORE" });
  };


  return (
    <div className="college-table-container">
      <input type="text" className="search-input" placeholder="Search by college name" value={state.searchTerm} onChange={handleSearch}/>
      <table className="college-table">
        <thead className="table-header">
          <tr>
            <th className="sortable" onClick={() => handleSort("rank")}>Rank</th>
            <th className="college-name">College Name</th>
            <th className="sortable" onClick={() => handleSort("fees")}>Fees</th>
            <th className="sortable" onClick={() => handleSort("placement")}>Placement (%)</th>
            <th className="sortable" onClick={() => handleSort("user_reviews")}>User Reviews</th>
            <th className="sortable" onClick={() => handleSort("rating")}>Rating</th>
            <th className="featured-college">Featured</th>
          </tr>
        </thead>
        <InfiniteScroll
          dataLength={state.colleges.length}
          next={fetchMoreData}
          hasMore={state.hasMore}
          loader={<h4 className="loader">Loading...</h4>}
          endMessage={<p className="end-message">End of list</p>}
        >
          <tbody className="table-body">
            {filteredAndSortedColleges.map((college) => (
              <tr key={college.id} className="table-row">
                <td className="rank">{college.rank}</td>
                <td className="college-name">{college.name}</td>
                <td className="fees">{college.fees}</td>
                <td className="placement">{college.placement}%</td>
                <td className="user-reviews">{college.user_reviews}</td>
                <td className="rating">{college.rating}</td>
                <td className="featured-college">{college.featured ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </InfiniteScroll>
      </table>
    </div>
  );
};

export default Table;

