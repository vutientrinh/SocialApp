import { useState } from "react";
import { Chip, InputBase, SxProps } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { SearchContainer, SearchBar } from "./styles";
import { useTranslation } from "react-i18next";

interface SearchCustomProps {
  // some props
  searchTitle?: string;
  sx?: SxProps;
}

const SearchCustom: React.FC<SearchCustomProps> = ({ searchTitle, sx }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm) {
      setSearchHistory([...searchHistory, searchTerm]);
      setSearchTerm("");
    }
  };

  const handleChipClick = (term: string) => {
    setSearchTerm(term);
  };

  const handleDelete = (itemToDelete: string) => {
    setSearchHistory(searchHistory.filter((item) => item !== itemToDelete));
  };

  return (
    <SearchContainer sx={sx}>
      <form onSubmit={handleSubmit}>
        <SearchBar>
          <SearchIcon sx={{ marginRight: 1 }} />
          {searchHistory.map((item, index) => (
            <Chip
              key={index}
              label={item}
              size="small"
              onClick={() => handleChipClick(item)}
              onDelete={() => handleDelete(item)}
              clickable
              style={{ marginRight: "4px" }}
            />
          ))}
          <InputBase
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={searchTitle ? t(searchTitle) : t("search")}
            fullWidth
            style={{ flex: 1, fontSize: "14px" }}
          />
        </SearchBar>
      </form>
    </SearchContainer>
  );
};

export default SearchCustom;
