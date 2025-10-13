import { FormControl } from 'react-bootstrap';
import lupa from '../assets/lupa.png'
import PropTypes from 'prop-types';

const SearchTextField = ({ texto, className, onTextChanged}) => {
    return (
        <div className={`search-text-field ${className}`}>
            <FormControl type="text" placeholder="Buscar" value={texto} onChange={onTextChanged}/>
            <img src={lupa} alt="buscar" />
        </div>
    );
}

SearchTextField.PropTypes = {
    Text: PropTypes.string,
    className: PropTypes.string,
    onTextChanged: PropTypes.func.isRequired,
}
 
export default SearchTextField;