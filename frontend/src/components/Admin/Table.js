import React from 'react';

const Table = (props) => {
    return (
        <div>
            <button onClick={props.handleAdd}>Add new {props.addBtnText}</button>
            <table>
                <thead>
                    <tr>
                        <th>SN</th>
                        {props.headers.map((name, i) => <th key={i}>{name}</th>)}
                        <th key={99}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {props.rows.map((row, i) => {
                        return (<tr key={row.id} id={row.id}>
                            <td>{row.id}</td>
                            {Object.keys(row).filter(keyName => (keyName !== 'id' && keyName !== 'cid')).map(keyName => (<td key={keyName}>{row[keyName]}</td>))}
                            <td>
                                <button onClick={() => props.handleEdit(row)}>Edit</button> &nbsp;&nbsp;&nbsp;
                                <button onClick={() => props.handleDelete(row)}>Delete</button>
                            </td>
                        </tr>)
                    })}
                    {props.rows.length === 0 && <tr><td colSpan={props.headers.length}>No Records Found!!</td></tr>}
                </tbody>
            </table>
        </div>
    );
};

export default Table;