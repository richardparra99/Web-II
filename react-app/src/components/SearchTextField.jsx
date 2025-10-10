import { FormControl } from 'react-bootstrap';
import lupa from '../assets/lupa.png'

const SearchTextField = ({ texto, className, onTextChanged}) => {
    return (
        <div className={`search-text-field ${className}`}>
            <FormControl type="text" placeholder="Buscar" value={texto} onChange={onTextChanged}/>
            <img src={lupa} alt="buscar" />
        </div>
    );
}
 
export default SearchTextField;