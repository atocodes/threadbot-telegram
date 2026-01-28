import { TopicRepository } from "../../../domain/repositories"

export class FindManyTopicUsecase{
    constructor(private readonly repo:TopicRepository){}
    async execute(query:Record<string,any>){
        try {
            const result = await this.repo.findMany(query)
            return result
        } catch (error) {
            throw error
        }
    }
}