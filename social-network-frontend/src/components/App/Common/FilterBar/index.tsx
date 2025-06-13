import SearchCustom from "../../SeachBar";

interface FilterBarProps {}

const FilterBar: React.FC<FilterBarProps> = () => {
  return (
    <>
      {/* Add your search here */}
      <SearchCustom
        searchTitle={"navbar.search"}
        sx={{
          width: "350px",
        }}
      />
    </>
  );
};

export default FilterBar;
