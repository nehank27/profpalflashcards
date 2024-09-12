'use client'

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import {collection, doc, getDoc, getDocs} from 'firebase/firestore'
import {db} from '@/firebase'
import { Container, Box, Typography, Paper, TextField, Button, CardActionArea, Card, CardContent, DialogContentText, Dialog, DialogTitle, DialogContent, DialogActions, Grid } from "@mui/material";


import { useSearchParams } from "next/navigation"

export default function Flashcard(){
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])

    const searchParams = useSearchParams()
    const search = searchParams.get('id')

    useEffect(()=>{
        async function getFlashcard(){
            if(!search || !user) return
            const colRef = collection(doc(collection(db, 'users'), user.id), search)
            const docSnap = await getDocs(colRef)

            const flashcards = []
            
            docSnap.forEach((doc)=>{
                flashcards.push({id:doc.id, ...doc.data()})
            })
            setFlashcards(flashcards)
        }
        getFlashcard()     
    }, [user, search])

    const handleCardClick = (id)=> {
        setFlipped((prev) =>({
            [id]: !prev[id],
        }))
    }

    if(!isLoaded || !isSignedIn){
        return <></>
    }

    return (
        <Container maxWidth ="100vw">
            <Grid container spacing ={3} sx={{mt:4}}>
            
                {flashcards.map((flashcard, index)=>(
                    <Grid item xs ={12} sm={6} md={4} key={index}>
                        <Card>
                            <CardActionArea onClick={()=> {
                                handleCardClick(index)
                            }}>
                                <CardContent>
                                <Box
                                    sx={{
                                        perspective: '1000px',
                                        '& > div': {
                                        transition: 'transform 0.6s',
                                        transformStyle: 'preserve-3d',
                                        position: 'relative',
                                        width: '100%',
                                        height: '200px',
                                        boxShadow: '0 4px 0 rgb(0, 0, 0, 0.2)',
                                        transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                        },
                                        '& > div > div': {
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        backfaceVisibility: 'hidden',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: 2,
                                        boxSizing: 'border-box',
                                        },
                                        '& > div > div:nth-of-type(2)': {
                                        transform: 'rotateY(180deg)',
                                        },
                                    }}
                                    >
                                    <div>
                                        <div>
                                        <Typography variant="h5" component="div">
                                            {flashcard.front}
                                        </Typography>
                                        </div>
                                        <div>
                                        <Typography variant="h5" component="div">
                                            {flashcard.back}
                                        </Typography>
                                        </div>
                                    </div>
                                    </Box>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}    

            </Grid>
        </Container>
    )
}