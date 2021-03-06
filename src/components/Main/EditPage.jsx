import dayjs from 'dayjs';
import React, { useState, useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Link } from "react-router-dom";
import styled from 'styled-components';
import UserContext from '../../contexts/UserContext';
import WalletContext from '../../contexts/WalletContext';
import { ThreeDots } from 'react-loader-spinner';

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
`

const Header = styled.div`
    width: 100%;
    flex: 0 0 auto;
    margin-bottom: 40px;
    display: flex;
    justify-content: space-between;
    ion-icon {
        --ionicon-stroke-width: 32px;
        font-size: 24px;
        cursor: pointer;
        padding: 2px;
        border-radius: 5px;
        :hover {
            background-color: rgba(0,0,0,0.1);
        }
    }
`

const WelcomeLabel = styled.h1`
    font-size: 26px;
    font-weight: 700;
`

const InputsContainer = styled.div`
    display:flex;
    flex-direction: column;
    width:100%;
    gap:13px;
`

const Content = styled.div`
    flex: 1 1 auto;
    overflow-y: auto;
    border-radius: 5px;
`

const Input = styled.input`
    width: 100%;
    height: 58px;
    border: none;
    border-radius: 5px;
    color: black;
    font-size: 20px;
    padding-left: 15px;

    &::placeholder {}

    &:disabled,
    &[disabled]{
        color: white;
    }
`

const ValueInput = styled.input`
    width: 100%;
    height: 58px;
    border: none;
    border-radius: 5px;
    color: ${props => props.type === "credit" ? "var(--green)" : "var(--red)"};
    font-size: 20px;
    padding-left: 15px;

    &::placeholder {}

    &:disabled,
    &[disabled]{
        color: white;
    }
`



const SubmitButton = styled.button`
    width: 100%;
    height: 46px;
    background-color: var(--purple-light);
    border: none;
    border-radius: 5px;
    font-weight: 700;
    font-size: 20px;

    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;
    :hover {background-color: var(--purple-light-hover);}
`

const Bottom = styled.div`
    width: 100%;
    flex: 0 0 auto;
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
    gap: 15px;
`


const WrapButtons = styled.div`
    width: 100%;
    flex: 0 0 auto;
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
    gap: 15px;
`

const TypeButton = styled.button`
    background-color: var(--purple-light);
    width: 100%;
    height: 58px;
    padding: 10px;
    border-radius: 5px;
    border: ${props => props.selected ? "2px solid white" : "none"};

    display: flex;
    align-items: center;
    justify-content: center;

    ion-icon {
        --ionicon-stroke-width: 32px;
        font-size: 32px;
    }

    cursor: pointer;
    :hover {background-color: var(--purple-light-hover);}
`


export default function EditPage({transaction}) {

    const {submitTransaction, abortEdit} = useContext(WalletContext);

    const [value, setValue] = useState(transaction.value ? transaction.value : 0);
    const [date, setDate] = useState(transaction.date ? transaction.date : dayjs().format("DD/MM"));
    const [description, setDescription] = useState(transaction.description ? transaction.description : "");
    const [type, setType] = useState(transaction.type ? transaction.type : "credit");
    const [id, setId] = useState(transaction._id ? transaction._id : null);
    
    const [isEditing, setIsEditing] = useState(true);

    function readValue(e) {
        const label = e.target.value;
        let newLab = "";
        for (let i=0; i<label.length; i++) {
            if (Number(label[i]) >= 0) {
                newLab += label[i];
            }
        }
        let newValue = Number(newLab)/100;
        setValue(newValue);
    }

    function writeValue(value) {
        let decimals = value % 1;
        let inteiros = (value - decimals).toString();
        let inteirosLabel = "";
        for (let i = 1; i <= inteiros.length; i++) {
            if ((i-1) % 3 === 0 && i>1) {inteirosLabel = "." + inteirosLabel}
            inteirosLabel = inteiros[inteiros.length - i] + inteirosLabel;
        }
        let dec2 = Math.round(decimals*100)
        return inteirosLabel + "," + (dec2 < 10 ? "0" : "") + dec2;
    }

    async function clickSubmit() {
        setIsEditing(false);
        try {
            const result = await submitTransaction({value, description, type, date, id});
            setIsEditing(true);
        } catch {
            setIsEditing(true);
        }
    }


    return (
        <Container>
            <Header>
                <WelcomeLabel>{`${id ? "Editar" : "Nova"} ${type === 'credit' ? "entrada" : "sa??da"}`}</WelcomeLabel>
                <ion-icon name="close-outline" size="large" onClick={() => {abortEdit()}}></ion-icon>
            </Header>
            <Content>
                <InputsContainer>
                    <WrapButtons>
                        <TypeButton disabled={!isEditing} selected={type === 'credit'} onClick={() => setType('credit')}>
                            <ion-icon name="add-circle-outline"></ion-icon>
                        </TypeButton>
                        <TypeButton disabled={!isEditing} selected={type === 'debt'} onClick={() => setType('debt')}>
                            <ion-icon name="remove-circle-outline"></ion-icon>
                        </TypeButton>
                    </WrapButtons>

                    <ValueInput disabled={!isEditing} type={type} placeholder="Valor" value={writeValue(value)} onChange={readValue}/>
                    <Input disabled={!isEditing} placeholder="Descri????o" value={description} onChange={e => {setDescription(e.target.value)}}/>
                    
                    <SubmitButton disabled={!isEditing} onClick={clickSubmit}>
                        {isEditing
                            ? (`${id ? "Atualizar" : "Salvar"} ${type === 'credit' ? "entrada" : "sa??da"}`)
                            : <ThreeDots color="#fff" height={50} width={50} />
                        }
                    </SubmitButton>
                </InputsContainer>
            </Content>
        </Container>
    )
}