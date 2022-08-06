export interface GoogleBooksItem {
  accessInfo: {
    accessViewStatus: string
    country: string
    embeddable: boolean
    epub: {
      isAvailable: boolean
    }
    pdf: {
      isAvailable: boolean
    }
    publicDomain: boolean
    quoteSharingAllowed: boolean
    textToSpeechPermission: string
    viewability: string
    webReaderLink: string
  }
  etag: string
  id: string
  kind: string
  saleInfo: {
    country: string
    isEbook: boolean
    saleability: string
    listPrice?: {
      amount: number
      currencyCode: string
    }
    retailPrice?: {
      amount: number
      currencyCode: string
    }
  }
  searchInfo: {
    textSnippet: string
  }
  selfLink: string
  volumeInfo: {
    allowAnonLogging: boolean
    authors: string[]
    averageRating: number
    canonicalVolumeLink: string
    categories: string[]
    comicsContent: boolean
    contentVersion: string
    description: string
    imageLinks: {
      smallThumbnail: string
      thumbnail: string
    }
    industryIdentifiers: GoogleBooksIndustryIdentifiers[]
    infoLink: string
    language: string
    maturityRating: string
    pageCount: number
    panelizationSummary: {
      containsEpubBubbles: boolean
      containsImageBubbles: boolean
    }
    previewLink: string
    printType: string
    publishedDate: string
    publisher: string
    ratingsCount: number
    readingModes: {
      text: boolean
      image: boolean
    }
    subtitle: string
    title: string
  }
}

export interface GoogleBooksIndustryIdentifiers {
  identifier: string
  type: string
}
