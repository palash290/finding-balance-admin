import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any[], searchTerm: string): any[] {
    if (!value || !searchTerm) {
      return value;
    }

    return value.filter(item => {
      return item.name && item.name.toLowerCase().includes(searchTerm) || item.name && item.name.includes(searchTerm) ||
        item.full_name && item.full_name.toLowerCase().includes(searchTerm) || item.full_name && item.full_name.includes(searchTerm) ||
        item.title && item.title.toLowerCase().includes(searchTerm) || item.title && item.title.includes(searchTerm)
      // item.participants[0]?.Coach?.full_name && item.participants[0]?.Coach?.full_name.toLowerCase().includes(searchTerm) || 
      // item.participants[0]?.User?.full_name && item.participants[0]?.User?.full_name.toLowerCase().includes(searchTerm)
    });
  }
}//item.participant?.Coach?.full_name




@Pipe({
  name: 'chatFilter'
})
export class ChatFilterPipe implements PipeTransform {

  transform(value: any[], searchTerm: string): any[] {
    if (!value || !searchTerm) {
      return value;
    }

    searchTerm = searchTerm.toLowerCase();

    return value.filter(item => {
      debugger
      const userName = item.user?.full_name?.toLowerCase() || '';
      const userName1 = item.user?.full_name || '';

      // const coachName = item.coachSubscriptions[0]?.coach?.full_name?.toLowerCase() || '';
      // const coachName1 = item.coachSubscriptions[0]?.coach?.full_name || '';

      return userName.includes(searchTerm) || userName1.includes(searchTerm) 
      //|| coachName.includes(searchTerm) || coachName1.includes(searchTerm);
    });
  }
}//item.participant?.Coach?.full_name

@Pipe({
  name: 'chatFilter2'
})
export class ChatFilterPipe2 implements PipeTransform {

  transform(value: any[], searchTerm: string): any[] {
    if (!value || !searchTerm) {
      return value;
    }

    searchTerm = searchTerm.toLowerCase();

    return value.filter(item => {
      // debugger
      // const userName = item.user?.full_name?.toLowerCase() || '';
      // const userName1 = item.user?.full_name || '';

      const coachName = item.coach?.full_name?.toLowerCase() || '';
      const coachName1 = item.coach?.full_name || '';

      return coachName.includes(searchTerm) || coachName1.includes(searchTerm);
      //userName.includes(searchTerm) || userName1.includes(searchTerm) 
      //|| coachName.includes(searchTerm) || coachName1.includes(searchTerm);
    });
  }
}//item.participant?.Coach?.full_name